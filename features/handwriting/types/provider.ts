import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { HandwritingResult } from '@/features/output/types/output-result';
import type { UploadScene } from '@/features/upload/types/upload-input';

export type PreprocessResult = {
  buffer: Buffer;
  mimeType: string;
};

export type PreprocessProvider = {
  process(input: Buffer, mimeType: string): Promise<PreprocessResult>;
};

export type OcrProvider = {
  extract(input: Buffer, mimeType: string): Promise<OcrRawResult>;
};

export type RestructureProvider = {
  transform(input: OcrRawResult, scene?: UploadScene): Promise<HandwritingResult>;
};
