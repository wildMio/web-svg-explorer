import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { OverlayModule } from '@angular/cdk/overlay';
import {
  enableProdMode,
  importProvidersFrom,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppComponent } from './app/app.component';
import { I18nService } from './app/service/i18n.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAppInitializer(() => inject(I18nService).initialize()),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      A11yModule,
      OverlayModule,
      ClipboardModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      }),
    ),
  ],
}).catch((err) => console.error(err));
