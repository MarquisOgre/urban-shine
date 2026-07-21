import type jsPDF from "jspdf";

// Noto Sans Telugu Regular (SIL OFL). Fetched once and cached in memory.
const FONT_URL =
  "https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts/hinted/ttf/NotoSansTelugu/NotoSansTelugu-Regular.ttf";

export const TELUGU_FONT_NAME = "NotoTelugu";
const VFS_FILE = "NotoSansTelugu-Regular.ttf";

let cachedBase64: string | null = null;
let inflight: Promise<string> | null = null;

const arrayBufferToBase64 = (buf: ArrayBuffer): string => {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

const loadBase64 = async (): Promise<string> => {
  if (cachedBase64) return cachedBase64;
  if (!inflight) {
    inflight = fetch(FONT_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`Font fetch failed: ${r.status}`);
        return r.arrayBuffer();
      })
      .then((buf) => {
        cachedBase64 = arrayBufferToBase64(buf);
        return cachedBase64;
      })
      .catch((err) => {
        inflight = null;
        throw err;
      });
  }
  return inflight;
};

/**
 * Registers Noto Sans Telugu on the given jsPDF instance. Safe to call
 * multiple times per document. Returns true if the font is usable.
 */
export const ensureTeluguFont = async (doc: jsPDF): Promise<boolean> => {
  try {
    const b64 = await loadBase64();
    doc.addFileToVFS(VFS_FILE, b64);
    doc.addFont(VFS_FILE, TELUGU_FONT_NAME, "normal");
    return true;
  } catch (e) {
    console.warn("Telugu PDF font unavailable, falling back:", e);
    return false;
  }
};
