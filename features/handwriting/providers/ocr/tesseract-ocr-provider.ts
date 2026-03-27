import path from 'node:path';
import { createWorker } from 'tesseract.js';
import type { OcrLine, OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { OcrProvider } from '@/features/handwriting/types/provider';

type TesseractLine = {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
};

type TesseractRecognizeResult = {
  data: {
    text: string;
    confidence: number;
    lines?: TesseractLine[];
  };
};

function toTesseractImageInput(input: Buffer): Buffer {
  return input;
}

function getWorkerPath(): string {
  return path.join(process.cwd(), 'node_modules', 'tesseract.js', 'src', 'worker-script', 'node', 'index.js');
}

export class TesseractOcrProvider implements OcrProvider {
  async extract(input: Buffer, mimeType: string): Promise<OcrRawResult> {
    void mimeType;

    const image = toTesseractImageInput(input);
    const workerPath = getWorkerPath();
    const worker = await createWorker('eng', 1, {
      workerPath
    });

    try {
      const result = (await worker.recognize(image)) as TesseractRecognizeResult;
      const lines: OcrLine[] = (result.data.lines ?? [])
        .map((line) => ({
          text: line.text.trim(),
          confidence: line.confidence,
          bbox: {
            x: line.bbox.x0,
            y: line.bbox.y0,
            width: line.bbox.x1 - line.bbox.x0,
            height: line.bbox.y1 - line.bbox.y0
          }
        }))
        .filter((line) => line.text.length > 0);

      return {
        text: result.data.text.trim(),
        confidence: result.data.confidence,
        lines
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Tesseract OCR failed.';
      throw new Error(`Tesseract OCR failed: ${message}`);
    } finally {
      try {
        await worker.terminate();
      } catch {
        // Ignore worker termination errors to avoid masking the OCR failure.
      }
    }
  }
}
