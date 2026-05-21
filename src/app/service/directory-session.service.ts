import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

import {
  directoryOpen,
  type FileWithDirectoryHandle,
  supported as fileSystemAccessSupported,
} from 'browser-fs-access';

type DirectoryPermissionDescriptor = {
  mode?: 'read' | 'readwrite';
};

type PermissionAwareHandle = FileSystemHandle & {
  queryPermission(
    descriptor?: DirectoryPermissionDescriptor,
  ): Promise<PermissionState>;
  requestPermission(
    descriptor?: DirectoryPermissionDescriptor,
  ): Promise<PermissionState>;
};

type StoredDirectoryHandle = PermissionAwareHandle & {
  kind: 'directory';
  values(): AsyncIterable<StoredDirectoryEntry>;
};

type StoredFileHandle = PermissionAwareHandle & {
  kind: 'file';
  getFile(): Promise<File>;
};

type StoredDirectoryEntry = StoredDirectoryHandle | StoredFileHandle;

type DirectoryPickerWindow = Window &
  typeof globalThis & {
    showDirectoryPicker?: (options?: {
      id?: string;
    }) => Promise<StoredDirectoryHandle>;
  };

const DIRECTORY_PICKER_ID = 'svgolot-directory';
const DIRECTORY_SESSION_DB = 'svgolot-directory-session';
const DIRECTORY_SESSION_STORE = 'handles';
const LAST_DIRECTORY_KEY = 'last-opened-directory';

export type StoredDirectoryAccess = PermissionState | 'missing' | 'unsupported';

export type StoredDirectorySnapshot = {
  directoryName: string | null;
  access: StoredDirectoryAccess;
};

export type RestoredDirectoryResult = StoredDirectorySnapshot & {
  files: FileWithDirectoryHandle[];
  restored: boolean;
};

export type PickedDirectoryResult = {
  directoryName: string | null;
  files: FileWithDirectoryHandle[];
};

@Injectable({
  providedIn: 'root',
})
export class DirectorySessionService {
  private readonly document = inject<Document>(DOCUMENT);
  private databasePromise: Promise<IDBDatabase | null> | null = null;

  async pickDirectory(): Promise<PickedDirectoryResult | null> {
    const pickerWindow = this.document
      .defaultView as DirectoryPickerWindow | null;
    const showDirectoryPicker = pickerWindow?.showDirectoryPicker;

    if (fileSystemAccessSupported && showDirectoryPicker) {
      try {
        const directoryHandle = await showDirectoryPicker.call(pickerWindow, {
          id: DIRECTORY_PICKER_ID,
        });
        const files = await this.readFilesFromDirectoryHandle(directoryHandle);

        await this.persistHandle(directoryHandle);

        return {
          directoryName: directoryHandle.name,
          files,
        };
      } catch (error) {
        if (this.isAbortError(error)) {
          return null;
        }

        throw error;
      }
    }

    try {
      const files = await directoryOpen();
      const directoryHandle = this.extractDirectoryHandle(files);

      if (directoryHandle) {
        await this.persistHandle(directoryHandle);
      }

      return {
        directoryName: directoryHandle?.name ?? null,
        files,
      };
    } catch (error) {
      if (this.isAbortError(error)) {
        return null;
      }

      throw error;
    }
  }

  async getStoredDirectorySnapshot(): Promise<StoredDirectorySnapshot> {
    if (!this.canPersistDirectoryHandle()) {
      return {
        directoryName: null,
        access: 'unsupported',
      };
    }

    const directoryHandle = await this.readStoredHandle();

    if (!directoryHandle) {
      return {
        directoryName: null,
        access: 'missing',
      };
    }

    try {
      return {
        directoryName: directoryHandle.name,
        access: await directoryHandle.queryPermission({
          mode: 'read',
        }),
      };
    } catch {
      await this.clearStoredHandle();

      return {
        directoryName: null,
        access: 'missing',
      };
    }
  }

  async restoreStoredDirectory(
    options: { promptForPermission?: boolean } = {},
  ): Promise<RestoredDirectoryResult> {
    if (!this.canPersistDirectoryHandle()) {
      return {
        directoryName: null,
        access: 'unsupported',
        files: [],
        restored: false,
      };
    }

    const directoryHandle = await this.readStoredHandle();

    if (!directoryHandle) {
      return {
        directoryName: null,
        access: 'missing',
        files: [],
        restored: false,
      };
    }

    try {
      const access = await this.resolveReadPermission(
        directoryHandle,
        options.promptForPermission ?? false,
      );

      if (access !== 'granted') {
        return {
          directoryName: directoryHandle.name,
          access,
          files: [],
          restored: false,
        };
      }

      return {
        directoryName: directoryHandle.name,
        access,
        files: await this.readFilesFromDirectoryHandle(directoryHandle),
        restored: true,
      };
    } catch (error) {
      if (this.isMissingEntryError(error)) {
        await this.clearStoredHandle();

        return {
          directoryName: null,
          access: 'missing',
          files: [],
          restored: false,
        };
      }

      return {
        directoryName: directoryHandle.name,
        access: 'prompt',
        files: [],
        restored: false,
      };
    }
  }

  private canPersistDirectoryHandle() {
    return !!this.document.defaultView?.indexedDB && fileSystemAccessSupported;
  }

  private extractDirectoryHandle(
    files: readonly FileWithDirectoryHandle[],
  ): StoredDirectoryHandle | null {
    const directoryHandle = files[0]?.directoryHandle;

    return directoryHandle?.kind === 'directory'
      ? (directoryHandle as StoredDirectoryHandle)
      : null;
  }

  private async readFilesFromDirectoryHandle(
    directoryHandle: StoredDirectoryHandle,
  ) {
    const files: FileWithDirectoryHandle[] = [];

    for await (const entry of directoryHandle.values()) {
      if (entry.kind !== 'file') {
        continue;
      }

      const file = (await entry.getFile()) as FileWithDirectoryHandle;

      file.directoryHandle = directoryHandle;
      files.push(file);
    }

    return files;
  }

  private async resolveReadPermission(
    directoryHandle: StoredDirectoryHandle,
    promptForPermission: boolean,
  ): Promise<PermissionState> {
    const currentPermission = await directoryHandle.queryPermission({
      mode: 'read',
    });

    if (currentPermission === 'granted' || !promptForPermission) {
      return currentPermission;
    }

    return directoryHandle.requestPermission({
      mode: 'read',
    });
  }

  private async persistHandle(directoryHandle: StoredDirectoryHandle) {
    const database = await this.getDatabase();

    if (!database) {
      return;
    }

    await new Promise<void>((resolve) => {
      const request = database
        .transaction(DIRECTORY_SESSION_STORE, 'readwrite')
        .objectStore(DIRECTORY_SESSION_STORE)
        .put(directoryHandle, LAST_DIRECTORY_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  }

  private async readStoredHandle() {
    const database = await this.getDatabase();

    if (!database) {
      return null;
    }

    return new Promise<StoredDirectoryHandle | null>((resolve) => {
      const request = database
        .transaction(DIRECTORY_SESSION_STORE, 'readonly')
        .objectStore(DIRECTORY_SESSION_STORE)
        .get(LAST_DIRECTORY_KEY);

      request.onsuccess = () => {
        resolve((request.result as StoredDirectoryHandle | undefined) ?? null);
      };
      request.onerror = () => resolve(null);
    });
  }

  private async clearStoredHandle() {
    const database = await this.getDatabase();

    if (!database) {
      return;
    }

    await new Promise<void>((resolve) => {
      const request = database
        .transaction(DIRECTORY_SESSION_STORE, 'readwrite')
        .objectStore(DIRECTORY_SESSION_STORE)
        .delete(LAST_DIRECTORY_KEY);

      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
    });
  }

  private getDatabase() {
    if (!this.canPersistDirectoryHandle()) {
      return Promise.resolve(null);
    }

    if (!this.databasePromise) {
      this.databasePromise = new Promise((resolve) => {
        try {
          const request = this.document.defaultView!.indexedDB.open(
            DIRECTORY_SESSION_DB,
            1,
          );

          request.onupgradeneeded = () => {
            if (
              !request.result.objectStoreNames.contains(DIRECTORY_SESSION_STORE)
            ) {
              request.result.createObjectStore(DIRECTORY_SESSION_STORE);
            }
          };

          request.onsuccess = () => {
            request.result.onversionchange = () => request.result.close();
            resolve(request.result);
          };
          request.onerror = () => resolve(null);
        } catch {
          resolve(null);
        }
      });
    }

    return this.databasePromise;
  }

  private isAbortError(error: unknown) {
    return error instanceof DOMException && error.name === 'AbortError';
  }

  private isMissingEntryError(error: unknown) {
    return error instanceof DOMException && error.name === 'NotFoundError';
  }
}
