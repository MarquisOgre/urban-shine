// Render Telugu (Indic) text to a PNG data URL using the browser's canvas
// text rendering, which performs proper complex-script shaping (reordering
// of vowel signs, formation of conjuncts). jsPDF cannot shape Indic scripts
// even with a Unicode font loaded, so we embed rendered text as images.

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSansTelugu/NotoSansTelugu-Regular.ttf";
const FONT_URL_BOLD =
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSansTelugu/NotoSansTelugu-Bold.ttf";
const FAMILY = "NotoSansTeluguWeb";

let fontLoadPromise: Promise<boolean> | null = null;

const loadBrowserFont = (): Promise<boolean> => {
  if (fontLoadPromise) return fontLoadPromise;
  fontLoadPromise = (async () => {
    try {
      if (typeof (window as any).FontFace === "undefined" || !(document as any).fonts) {
        return false;
      }
      const [regular, bold] = await Promise.all([
        new FontFace(FAMILY, `url(${FONT_URL})`, { weight: "400" }).load(),
        new FontFace(FAMILY, `url(${FONT_URL_BOLD})`, { weight: "700" }).load().catch(() =>
          new FontFace(FAMILY, `url(${FONT_URL})`, { weight: "700" }).load()
        ),
      ]);
      (document as any).fonts.add(regular);
      (document as any).fonts.add(bold);
      await (document as any).fonts.load(`700 40px "${FAMILY}"`);
      return true;
    } catch (e) {
      console.warn("Telugu web font load failed:", e);
      return false;
    }
  })();
  return fontLoadPromise;
};

export const ensureTeluguBrowserFont = () => loadBrowserFont();

const cache = new Map<string, RenderedText>();

export interface RenderedText {
  dataUrl: string;
  width: number;
  height: number;
}

export const renderTeluguToPng = (
  text: string,
  fontPx = 40,
  bold = true,
): RenderedText | null => {
  if (!text) return null;
  const key = `${fontPx}|${bold ? "b" : "n"}|${text}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const fontStack = `"${FAMILY}","Noto Sans Telugu","Gautami","Nirmala UI",sans-serif`;
  const weight = bold ? "700" : "400";
  const font = `${weight} ${fontPx}px ${fontStack}`;

  const measurer = document.createElement("canvas").getContext("2d");
  if (!measurer) return null;
  measurer.font = font;
  const metrics = measurer.measureText(text);
  const width = Math.max(1, Math.ceil(metrics.width) + 8);
  const height = Math.ceil(fontPx * 1.7);

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
