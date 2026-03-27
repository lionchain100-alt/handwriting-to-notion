import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { HandwritingResult } from '@/features/output/types/output-result';
import type { OutputMode } from '@/features/output/types/output-result';
import type { UploadScene } from '@/features/upload/types/upload-input';

export type ParseRequest = {
  image: File;
};

export type ParseResponse = {
  result: OcrRawResult;
};

export type FormatRequest = {
  ocr: OcrRawResult;
  mode?: OutputMode;
  scene?: UploadScene;
};

export type FormatResponse = {
  result: HandwritingResult;
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};
