import { NextResponse } from 'next/server';
import type { ApiErrorResponse, ParseResponse } from '@/features/handwriting/types/api';
import { TesseractOcrProvider } from '@/features/handwriting/providers/ocr/tesseract-ocr-provider';
import { createApiErrorResponse } from '@/features/handwriting/services/api-error-response';
import { APP_ERROR_CODE, createAppError, mapImageValidationErrorCode } from '@/features/handwriting/services/error-mapping';
import { extractText } from '@/features/handwriting/services/extract-text';
import { IdentityPreprocessProvider, preprocessImage } from '@/features/handwriting/services/preprocess-image';
import { validateImageFile } from '@/features/upload/services/validate-image';

const MAX_FILE_SIZE_IN_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export async function POST(request: Request): Promise<NextResponse<ParseResponse | ApiErrorResponse>> {
  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return createApiErrorResponse(createAppError(APP_ERROR_CODE.INVALID_TYPE), 400);
    }

    const validationResult = validateImageFile(image, {
      maxFileSizeInBytes: MAX_FILE_SIZE_IN_BYTES,
      allowedMimeTypes: ALLOWED_MIME_TYPES
    });

    if (!validationResult.success) {
      return createApiErrorResponse(mapImageValidationErrorCode(validationResult.error.code), 400);
    }

    const inputBuffer = Buffer.from(await image.arrayBuffer());
    const preprocessProvider = new IdentityPreprocessProvider();
    const preprocessResult = await preprocessImage(preprocessProvider, inputBuffer, image.type);
    const ocrProvider = new TesseractOcrProvider();
    const result = await extractText(ocrProvider, preprocessResult.buffer, preprocessResult.mimeType);

    return NextResponse.json({ result });
  } catch {
    return createApiErrorResponse(createAppError(APP_ERROR_CODE.OCR_FAILED), 500);
  }
}
