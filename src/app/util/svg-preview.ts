import { encodeSVG } from './encodeSvg';

type PaintClassification =
  | { kind: 'skip' }
  | { kind: 'current' }
  | { kind: 'complex' }
  | { kind: 'color'; value: string };

export type SvgPreviewOptions = {
  color?: string | null;
  contrastPreview?: boolean;
};

const PREVIEW_LIGHT_TONE = '#f0e6d3';
const PREVIEW_DARK_TONE = '#12100d';
const DUPLICATE_FINGERPRINT_TONE = '#8f6a25';
const PREVIEW_CANVAS_SIZE = 96;
const PAINT_ATTRIBUTES = ['fill', 'stroke', 'color', 'stop-color'] as const;

const resolveCssColor = (value: string | null | undefined): string | null => {
  if (!value || !globalThis.document) {
    return null;
  }

  const probe = globalThis.document.createElement('span');
  probe.style.color = '';
  probe.style.color = value.trim();

  return probe.style.color || null;
};

const parseRgbColor = (value: string): [number, number, number] | null => {
  const normalized = resolveCssColor(value) ?? value;

  if (normalized.startsWith('#')) {
    const hex = normalized.slice(1);

    if (hex.length === 3) {
      return [
        Number.parseInt(`${hex[0]}${hex[0]}`, 16),
        Number.parseInt(`${hex[1]}${hex[1]}`, 16),
        Number.parseInt(`${hex[2]}${hex[2]}`, 16),
      ];
    }

    if (hex.length === 6) {
      return [
        Number.parseInt(hex.slice(0, 2), 16),
        Number.parseInt(hex.slice(2, 4), 16),
        Number.parseInt(hex.slice(4, 6), 16),
      ];
    }
  }

  const rgbMatch = normalized.match(/rgba?\(([^)]+)\)/i);

  if (!rgbMatch) {
    return null;
  }

  const [red, green, blue] = rgbMatch[1]
    .split(',')
    .slice(0, 3)
    .map((channel) => Number.parseFloat(channel.trim()));

  if ([red, green, blue].some((channel) => Number.isNaN(channel))) {
    return null;
  }

  return [red, green, blue];
};

const toRelativeLuminance = ([red, green, blue]: [number, number, number]) => {
  const linearize = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return (
    0.2126 * linearize(red) +
    0.7152 * linearize(green) +
    0.0722 * linearize(blue)
  );
};

const classifyPaintValue = (value: string | null): PaintClassification => {
  if (!value) {
    return { kind: 'skip' };
  }

  const normalized = value.trim();

  if (!normalized) {
    return { kind: 'skip' };
  }

  const lowerCased = normalized.toLowerCase();

  if (
    [
      'none',
      'transparent',
      'inherit',
      'initial',
      'unset',
      'context-fill',
      'context-stroke',
    ].includes(lowerCased)
  ) {
    return { kind: 'skip' };
  }

  if (lowerCased === 'currentcolor') {
    return { kind: 'current' };
  }

  if (lowerCased.startsWith('url(') || lowerCased.startsWith('var(')) {
    return { kind: 'complex' };
  }

  const resolvedColor = resolveCssColor(normalized);

  return resolvedColor
    ? { kind: 'color', value: resolvedColor }
    : { kind: 'complex' };
};

const parseStyleDeclarations = (styleText: string) =>
  styleText
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const [property, ...rawValue] = declaration.split(':');
      return {
        property: property.trim(),
        value: rawValue.join(':').trim(),
      };
    });

const serializeStyleDeclarations = (
  declarations: Array<{ property: string; value: string }>,
) =>
  declarations.map(({ property, value }) => `${property}: ${value}`).join('; ');

const collectPaintProfile = (svgElement: SVGElement) => {
  const solidColors = new Set<string>();
  let hasCurrentColor = false;
  let hasComplexPaint = false;

  for (const element of [svgElement, ...svgElement.querySelectorAll('*')]) {
    for (const attribute of PAINT_ATTRIBUTES) {
      const classification = classifyPaintValue(
        element.getAttribute(attribute),
      );

      if (classification.kind === 'color') {
        solidColors.add(classification.value);
      }

      if (classification.kind === 'current') {
        hasCurrentColor = true;
      }

      if (classification.kind === 'complex') {
        hasComplexPaint = true;
      }
    }

    const styleText = element.getAttribute('style');

    if (!styleText) {
      continue;
    }

    for (const declaration of parseStyleDeclarations(styleText)) {
      if (
        !PAINT_ATTRIBUTES.includes(
          declaration.property as (typeof PAINT_ATTRIBUTES)[number],
        )
      ) {
        continue;
      }

      const classification = classifyPaintValue(declaration.value);

      if (classification.kind === 'color') {
        solidColors.add(classification.value);
      }

      if (classification.kind === 'current') {
        hasCurrentColor = true;
      }

      if (classification.kind === 'complex') {
        hasComplexPaint = true;
      }
    }
  }

  return {
    hasCurrentColor,
    recolorable:
      !hasComplexPaint &&
      (solidColors.size === 1 || (solidColors.size === 0 && hasCurrentColor)),
  };
};

const recolorSvgText = (svgText: string, previewColor: string) => {
  const parser = new DOMParser();
  const document = parser.parseFromString(svgText, 'image/svg+xml');
  const svgRoot = document.documentElement;

  if (
    svgRoot.nodeName.toLowerCase() !== 'svg' ||
    document.querySelector('parsererror')
  ) {
    return svgText.replace(/currentColor/g, previewColor);
  }

  const svgElement = svgRoot as unknown as SVGElement;
  const profile = collectPaintProfile(svgElement);

  if (!profile.hasCurrentColor && !profile.recolorable) {
    return svgText;
  }

  svgRoot.setAttribute('color', previewColor);

  for (const element of [svgElement, ...svgElement.querySelectorAll('*')]) {
    for (const attribute of PAINT_ATTRIBUTES) {
      const classification = classifyPaintValue(
        element.getAttribute(attribute),
      );

      if (
        classification.kind === 'current' ||
        (profile.recolorable && classification.kind === 'color')
      ) {
        element.setAttribute(attribute, previewColor);
      }
    }

    const styleText = element.getAttribute('style');

    if (!styleText) {
      continue;
    }

    const declarations = parseStyleDeclarations(styleText).map(
      (declaration) => {
        if (
          !PAINT_ATTRIBUTES.includes(
            declaration.property as (typeof PAINT_ATTRIBUTES)[number],
          )
        ) {
          return declaration;
        }

        const classification = classifyPaintValue(declaration.value);

        if (
          classification.kind === 'current' ||
          (profile.recolorable && classification.kind === 'color')
        ) {
          return {
            ...declaration,
            value: previewColor,
          };
        }

        return declaration;
      },
    );

    element.setAttribute('style', serializeStyleDeclarations(declarations));
  }

  return new XMLSerializer().serializeToString(svgElement);
};

const hashBytes = (bytes: Uint8ClampedArray) => {
  let hash = 2166136261;

  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
};

const hashText = (value: string) => {
  let hash = 2166136261;

  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
};

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to render SVG preview.'));
    image.src = src;
  });

export const resolvePreviewTone = (
  color: string | null | undefined,
  contrastPreview: boolean,
) => {
  const resolvedColor = resolveCssColor(color);

  if (!resolvedColor) {
    return null;
  }

  if (!contrastPreview) {
    return resolvedColor;
  }

  const rgbColor = parseRgbColor(resolvedColor);

  if (!rgbColor) {
    return PREVIEW_DARK_TONE;
  }

  return toRelativeLuminance(rgbColor) > 0.52
    ? PREVIEW_DARK_TONE
    : PREVIEW_LIGHT_TONE;
};

export const createPreviewSvgText = (
  svgText: string,
  options: SvgPreviewOptions = {},
) => {
  const previewTone = resolvePreviewTone(
    options.color ?? null,
    options.contrastPreview ?? false,
  );

  if (!previewTone) {
    return svgText;
  }

  return recolorSvgText(svgText, previewTone);
};

export const createPreviewSvgDataUri = (
  svgText: string,
  options: SvgPreviewOptions = {},
) => `data:image/svg+xml,${encodeSVG(createPreviewSvgText(svgText, options))}`;

export const createSvgVisualFingerprint = async (svgText: string) => {
  const normalizedPreviewSvg = createPreviewSvgText(svgText, {
    color: DUPLICATE_FINGERPRINT_TONE,
    contrastPreview: false,
  });

  if (!globalThis.document) {
    return hashText(normalizedPreviewSvg.replace(/\s+/g, ' ').trim());
  }

  try {
    const image = await loadImage(
      createPreviewSvgDataUri(normalizedPreviewSvg, { contrastPreview: false }),
    );
    const canvas = globalThis.document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      return hashText(normalizedPreviewSvg.replace(/\s+/g, ' ').trim());
    }

    canvas.width = PREVIEW_CANVAS_SIZE;
    canvas.height = PREVIEW_CANVAS_SIZE;

    const sourceWidth =
      image.naturalWidth || image.width || PREVIEW_CANVAS_SIZE;
    const sourceHeight =
      image.naturalHeight || image.height || PREVIEW_CANVAS_SIZE;
    const scale = Math.min(
      PREVIEW_CANVAS_SIZE / sourceWidth,
      PREVIEW_CANVAS_SIZE / sourceHeight,
    );
    const renderWidth = Math.max(1, Math.round(sourceWidth * scale));
    const renderHeight = Math.max(1, Math.round(sourceHeight * scale));
    const offsetX = Math.floor((PREVIEW_CANVAS_SIZE - renderWidth) / 2);
    const offsetY = Math.floor((PREVIEW_CANVAS_SIZE - renderHeight) / 2);

    context.clearRect(0, 0, PREVIEW_CANVAS_SIZE, PREVIEW_CANVAS_SIZE);
    context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);

    const imageData = context.getImageData(
      0,
      0,
      PREVIEW_CANVAS_SIZE,
      PREVIEW_CANVAS_SIZE,
    );

    return hashBytes(imageData.data);
  } catch {
    return hashText(normalizedPreviewSvg.replace(/\s+/g, ' ').trim());
  }
};
