import { PaddleOCR, type OcrResult } from '@paddleocr/paddleocr-js';

let ocrInstance: PaddleOCR | null = null;
let initPromise: Promise<PaddleOCR> | null = null;

export async function initOCR(): Promise<PaddleOCR> {
  if (ocrInstance) return ocrInstance;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const ocr = await PaddleOCR.create({
      lang: 'ch',
      ocrVersion: 'PP-OCRv5',
      ortOptions: {
        backend: 'auto',
      },
    });
    ocrInstance = ocr;
    return ocr;
  })();

  return initPromise;
}

export async function recognizeText(file: File | Blob): Promise<OcrResult> {
  const ocr = await initOCR();
  const [result] = await ocr.predict(file);
  return result;
}

export function extractText(result: OcrResult): string {
  return result.items.map((item) => item.text).join('\n');
}
