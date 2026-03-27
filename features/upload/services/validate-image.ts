import type { UploadImageInput } from '@/features/upload/types/upload-input';

export const IMAGE_VALIDATION_ERROR_CODE = {
  EMPTY_FILE: 'empty-file',
  INVALID_TYPE: 'invalid-type',
  FILE_TOO_LARGE: 'file-too-large'
} as const;

export type ImageValidationErrorCode =
  (typeof IMAGE_VALIDATION_ERROR_CODE)[keyof typeof IMAGE_VALIDATION_ERROR_CODE];

export type ImageValidationResult =
  | {
      success: true;
      image: UploadImageInput;
    }
  | {
      success: false;
      error: {
        code: ImageValidationErrorCode;
        message: string;
      };
    };

export type ValidateImageOptions = {
  maxFileSizeInBytes: number;
  allowedMimeTypes: string[];
};

export function validateImageFile(file: File, options: ValidateImageOptions): ImageValidationResult {
  if (file.size === 0) {
    return {
      success: false,
      error: {
        code: IMAGE_VALIDATION_ERROR_CODE.EMPTY_FILE,
        message: 'The selected file is empty.'
      }
    };
  }

  if (!options.allowedMimeTypes.includes(file.type)) {
    return {
      success: false,
      error: {
        code: IMAGE_VALIDATION_ERROR_CODE.INVALID_TYPE,
        message: 'Only image files are supported.'
      }
    };
  }

  if (file.size > options.maxFileSizeInBytes) {
    return {
      success: false,
      error: {
        code: IMAGE_VALIDATION_ERROR_CODE.FILE_TOO_LARGE,
        message: 'The selected image is too large.'
      }
    };
  }

  return {
    success: true,
    image: {
      file,
      previewUrl: '',
      mimeType: file.type,
      fileName: file.name,
      fileSize: file.size
    }
  };
}
