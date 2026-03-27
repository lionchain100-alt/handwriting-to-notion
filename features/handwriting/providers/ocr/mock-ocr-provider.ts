import type { OcrProvider } from '@/features/handwriting/types/provider';
import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';

export class MockOcrProvider implements OcrProvider {
  async extract(input: Buffer, mimeType: string): Promise<OcrRawResult> {
    void input;
    void mimeType;

    return {
      text: 'Meeting notes about product direction and next actions.',
      confidence: 92,
      lines: [
        {
          text: 'Meeting notes about product direction',
          confidence: 94,
          bbox: {
            x: 10,
            y: 10,
            width: 280,
            height: 24
          }
        },
        {
          text: 'and next actions.',
          confidence: 90,
          bbox: {
            x: 10,
            y: 42,
            width: 180,
            height: 24
          }
        }
      ]
    };
  }
}
