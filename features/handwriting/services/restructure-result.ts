import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { RestructureProvider } from '@/features/handwriting/types/provider';
import type { HandwritingResult } from '@/features/output/types/output-result';
import type { UploadScene } from '@/features/upload/types/upload-input';

export async function restructureResult(
  provider: RestructureProvider,
  input: OcrRawResult,
  scene?: UploadScene
): Promise<HandwritingResult> {
  return provider.transform(input, scene);
}
