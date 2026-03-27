import type { OcrProvider } from '@/features/handwriting/types/provider';
import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';

export async function extractText(
  provider: OcrProvider,
  input: Buffer,
  mimeType: string
): Promise<OcrRawResult> {
  return provider.extract(input, mimeType);
}
