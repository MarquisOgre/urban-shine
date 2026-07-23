// Render Telugu (or any complex-script) text to a PNG data URL using the
// browser's canvas text rendering, which performs proper Indic shaping.
// jsPDF cannot shape Indic scripts even with a Unicode font, so we embed
// the rendered text as an image inside the PDF cells.

const cache = new Map<string, { dataUrl: string; width: number; height: number }>();

export interface RenderedText {
  dataUrl: string;
  width: number;   // px at the render scale
  height: number;  // px at the render scale
}

/**
 * Renders text to a transparent PNG using a Telugu-capable system font stack.
 * The result is cached per (text + fontPx + bold) key.
 */
export const renderTeluguToPng = (
  text: string,
  fontPx = 40,
  bold = true,
): RenderedText | null => {
  if (!text) return null;
  const key = `${fontPx}|${bold ? "b" : "n"}|${text}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const fontStack =
    '"Noto Sans Telugu","Gautami","Nirmala UI","Mallanna","Ramabhadra",' +
    '"Suranna","Tenali Ramakrishna","Lohit Telugu",sans-serif';
  const weight = bold ? "700" : "400";
  const font = `${weight} ${fontPx}px ${fontStack}`;

  const measurer = document.createElement("canvas").getContext("2d");
  if (!measurer) return null;
  measurer.font = font;
  const metrics = measurer.measureText(text);
  const width = Math.ceil(metrics.width) + 8;
  const height = Math.ceil(fontPx * 1.6);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.font = font;
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(text, 4, height / 2);

  const result = { dataUrl: canvas.toDataURL("image/png"), width, height };
  cache.set(key, result);
  return result;
};
