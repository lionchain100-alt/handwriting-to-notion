'use client';

import { useMemo, useState } from 'react';
import { createImagePreviewUrl, revokeImagePreviewUrl } from '@/features/upload/services/image-preview';
import { validateImageFile } from '@/features/upload/services/validate-image';
import { UPLOAD_STATUS } from '@/features/upload/types/upload-status';
import type { ParseResponse } from '@/features/handwriting/types/api';
import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { UploadState } from '@/features/upload/types/upload-input';

const MAX_FILE_SIZE_IN_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

type UploadPanelProps = {
  onParsed?: (result: OcrRawResult) => void;
  onStatusChange?: (state: UploadState) => void;
};

const initialState: UploadState = {
  status: UPLOAD_STATUS.IDLE,
  image: null,
  errorMessage: null
};

export function UploadPanel({ onParsed, onStatusChange }: UploadPanelProps): JSX.Element {
  const [uploadState, setUploadState] = useState<UploadState>(initialState);

  const helperText = useMemo(() => {
    if (uploadState.errorMessage) {
      return uploadState.errorMessage;
    }

    if (uploadState.image) {
      return `${uploadState.image.fileName} · ${Math.round(uploadState.image.fileSize / 1024)} KB`;
    }

    return 'PNG, JPG, or WEBP up to 10MB.';
  }, [uploadState.errorMessage, uploadState.image]);

  function applyUploadState(nextState: UploadState): void {
    setUploadState(nextState);
    onStatusChange?.(nextState);
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    applyUploadState({
      ...uploadState,
      status: UPLOAD_STATUS.SELECTING,
      errorMessage: null
    });

    const validationResult = validateImageFile(file, {
      maxFileSizeInBytes: MAX_FILE_SIZE_IN_BYTES,
      allowedMimeTypes: ALLOWED_MIME_TYPES
    });

    if (!validationResult.success) {
      applyUploadState({
        status: UPLOAD_STATUS.ERROR,
        image: null,
        errorMessage: validationResult.error.message
      });
      return;
    }

    const previousPreviewUrl = uploadState.image?.previewUrl;

    if (previousPreviewUrl) {
      revokeImagePreviewUrl(previousPreviewUrl);
    }

    const previewUrl = createImagePreviewUrl(file);

    applyUploadState({
      status: UPLOAD_STATUS.UPLOADING,
      image: {
        ...validationResult.image,
        previewUrl
      },
      errorMessage: null
    });

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/handwriting/parse', {
        method: 'POST',
        body: formData
      });

      const payload = (await response.json()) as ParseResponse | { error?: { message?: string } };

      if (!response.ok) {
        const errorMessage = 'error' in payload ? payload.error?.message : undefined;
        throw new Error(errorMessage ?? 'Failed to parse the uploaded image.');
      }

      if (!('result' in payload)) {
        throw new Error('Failed to parse the uploaded image.');
      }

      applyUploadState({
        status: UPLOAD_STATUS.SUCCESS,
        image: {
          ...validationResult.image,
          previewUrl
        },
        errorMessage: null
      });

      onParsed?.(payload.result);
    } catch (error) {
      applyUploadState({
        status: UPLOAD_STATUS.ERROR,
        image: {
          ...validationResult.image,
          previewUrl
        },
        errorMessage: error instanceof Error ? error.message : 'Failed to parse the uploaded image.'
      });
    }
  }

  function handleReset(): void {
    if (uploadState.image?.previewUrl) {
      revokeImagePreviewUrl(uploadState.image.previewUrl);
    }

    applyUploadState(initialState);
  }

  return (
    <div className="space-y-4">
      <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-slate-400 hover:bg-slate-100">
        <input accept="image/png,image/jpeg,image/webp" className="hidden" type="file" onChange={handleFileChange} />

        {uploadState.image ? (
          <div className="flex w-full flex-col items-center gap-4">
            <img
              alt="Uploaded handwritten note preview"
              className="max-h-64 w-auto rounded-xl object-contain shadow-sm"
              src={uploadState.image.previewUrl}
            />
            <span className="text-sm font-medium text-slate-700">Click to choose another image</span>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-lg font-semibold text-slate-900">Upload your handwritten image</p>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Choose one image to start. This MVP works best with clear handwriting, simple note pages, and
              strong contrast between text and background.
            </p>
          </div>
        )}
      </label>

      <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
        <span>{helperText}</span>
        <button
          className="rounded-lg border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!uploadState.image && !uploadState.errorMessage}
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
