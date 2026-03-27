import { NextResponse } from 'next/server';
import type { ApiErrorResponse, FormatRequest, FormatResponse } from '@/features/handwriting/types/api';
import { BasicRestructureProvider } from '@/features/handwriting/providers/restructure/basic-restructure-provider';
import { createApiErrorResponse } from '@/features/handwriting/services/api-error-response';
import { APP_ERROR_CODE, createAppError } from '@/features/handwriting/services/error-mapping';
import { restructureResult } from '@/features/handwriting/services/restructure-result';

export async function POST(request: Request): Promise<NextResponse<FormatResponse | ApiErrorResponse>> {
  try {
    const body = (await request.json()) as FormatRequest;

    if (!body?.ocr) {
      return createApiErrorResponse(createAppError(APP_ERROR_CODE.RESTRUCTURE_FAILED), 400);
    }

    const restructureProvider = new BasicRestructureProvider();
    const result = await restructureResult(restructureProvider, body.ocr, body.scene);

    return NextResponse.json({ result });
  } catch {
    return createApiErrorResponse(createAppError(APP_ERROR_CODE.RESTRUCTURE_FAILED), 500);
  }
}
