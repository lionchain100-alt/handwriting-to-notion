import { NextResponse } from 'next/server';
import type { ApiErrorResponse } from '@/features/handwriting/types/api';
import type { AppError } from '@/features/handwriting/services/error-mapping';

export function createApiErrorResponse(error: AppError, status: number): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error
    },
    { status }
  );
}
