import { IMAGE_VALIDATION_ERROR_CODE, type ImageValidationErrorCode } from '@/features/upload/services/validate-image';

export const APP_ERROR_CODE = {
  EMPTY_FILE: IMAGE_VALIDATION_ERROR_CODE.EMPTY_FILE,
  INVALID_TYPE: IMAGE_VALIDATION_ERROR_CODE.INVALID_TYPE,
  FILE_TOO_LARGE: IMAGE_VALIDATION_ERROR_CODE.FILE_TOO_LARGE,
  OCR_FAILED: 'ocr-failed',
  RESTRUCTURE_FAILED: 'restructure-failed',
  UNKNOWN: 'unknown'
} as const;

export type AppErrorCode = (typeof APP_ERROR_CODE)[keyof typeof APP_ERROR_CODE];

export type AppError = {
  code: AppErrorCode;
  message: string;
};

const APP_ERROR_MESSAGE_MAP: Record<AppErrorCode, string> = {
  [APP_ERROR_CODE.EMPTY_FILE]: 'The selected file is empty. Please choose a handwritten image to continue.',
  [APP_ERROR_CODE.INVALID_TYPE]: 'Only PNG, JPG, and WEBP images are supported in this MVP.',
  [APP_ERROR_CODE.FILE_TOO_LARGE]: 'The selected image is too large. Please upload an image under 10MB.',
  [APP_ERROR_CODE.OCR_FAILED]: 'We could not read the handwriting clearly. Try a sharper photo with stronger contrast.',
  [APP_ERROR_CODE.RESTRUCTURE_FAILED]: 'We read the image, but could not turn it into a clean Notion-ready result.',
  [APP_ERROR_CODE.UNKNOWN]: 'Something went wrong. Please try again with another image.'
};

export function createAppError(code: AppErrorCode): AppError {
  return {
    code,
    message: APP_ERROR_MESSAGE_MAP[code]
  };
}

export function mapImageValidationErrorCode(code: ImageValidationErrorCode): AppError {
  return createAppError(code);
}

export function mapUnknownError(): AppError {
  return createAppError(APP_ERROR_CODE.UNKNOWN);
}
