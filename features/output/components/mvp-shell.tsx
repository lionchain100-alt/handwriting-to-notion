'use client';

import { useState } from 'react';
import { OutputPanel } from '@/features/output/components/output-panel';
import { OutputState } from '@/features/output/components/output-state';
import { ProcessingStatus } from '@/features/output/components/processing-status';
import { UploadPanel } from '@/features/upload/components/upload-panel';
import { UPLOAD_STATUS } from '@/features/upload/types/upload-status';
import type { FormatResponse } from '@/features/handwriting/types/api';
import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { HandwritingResult } from '@/features/output/types/output-result';
import type { UploadState } from '@/features/upload/types/upload-input';

const emptyResult: HandwritingResult = {
  plainText: '',
  structuredNotes: '',
  todoList: '',
  warnings: []
};

export function MvpShell(): JSX.Element {
  const [result, setResult] = useState<HandwritingResult>(emptyResult);
  const [uploadState, setUploadState] = useState<UploadState>({
    status: UPLOAD_STATUS.IDLE,
    image: null,
    errorMessage: null
  });
  const [resultState, setResultState] = useState<{
    status: 'idle' | 'processing' | 'success' | 'error';
    errorMessage: string | null;
  }>({
    status: 'idle',
    errorMessage: null
  });

  async function handleParsed(ocr: OcrRawResult): Promise<void> {
    setResult(emptyResult);
    setResultState({
      status: 'processing',
      errorMessage: null
    });

    try {
      if (!ocr.text.trim()) {
        throw new Error('No OCR text was detected from the uploaded image. Try a clearer photo or stronger handwriting contrast.');
      }

      const response = await fetch('/api/handwriting/format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ocr
        })
      });

      const payload = (await response.json()) as FormatResponse | { error?: { message?: string } };

      if (!response.ok) {
        const errorMessage = 'error' in payload ? payload.error?.message : undefined;
        throw new Error(errorMessage ?? 'We could not turn the OCR result into Notion-ready output.');
      }

      if (!('result' in payload)) {
        throw new Error('We could not turn the OCR result into Notion-ready output.');
      }

      if (!payload.result.plainText && !payload.result.structuredNotes && !payload.result.todoList) {
        throw new Error('Processing finished, but no usable output was returned. Please try another image.');
      }

      setResult(payload.result);
      setResultState({
        status: 'success',
        errorMessage: null
      });
    } catch (error) {
      setResult(emptyResult);
      setResultState({
        status: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'We could not turn the OCR result into Notion-ready output.'
      });
    }
  }

  function handleUploadStatusChange(nextUploadState: UploadState): void {
    setUploadState(nextUploadState);

    if (nextUploadState.status === UPLOAD_STATUS.IDLE) {
      setResult(emptyResult);
      setResultState({
        status: 'idle',
        errorMessage: null
      });
      return;
    }

    if (nextUploadState.status === UPLOAD_STATUS.ERROR) {
      setResult(emptyResult);
      setResultState({
        status: 'error',
        errorMessage: nextUploadState.errorMessage
      });
      return;
    }

    if (nextUploadState.status === UPLOAD_STATUS.SELECTING || nextUploadState.status === UPLOAD_STATUS.UPLOADING) {
      setResult(emptyResult);
      setResultState({
        status: 'idle',
        errorMessage: null
      });
    }
  }

  const processingStatus =
    uploadState.status === UPLOAD_STATUS.SELECTING || uploadState.status === UPLOAD_STATUS.UPLOADING
      ? uploadState.status
      : resultState.status === 'processing'
        ? UPLOAD_STATUS.PROCESSING
        : resultState.status === 'success'
          ? UPLOAD_STATUS.SUCCESS
          : resultState.status === 'error'
            ? UPLOAD_STATUS.ERROR
            : UPLOAD_STATUS.IDLE;

  const outputStatus =
    uploadState.status === UPLOAD_STATUS.ERROR
      ? UPLOAD_STATUS.ERROR
      : resultState.status === 'error'
        ? UPLOAD_STATUS.ERROR
        : resultState.status === 'processing'
          ? UPLOAD_STATUS.PROCESSING
          : resultState.status === 'success'
            ? UPLOAD_STATUS.SUCCESS
            : uploadState.status === UPLOAD_STATUS.SELECTING || uploadState.status === UPLOAD_STATUS.UPLOADING
              ? uploadState.status
              : UPLOAD_STATUS.IDLE;

  const outputErrorMessage = uploadState.errorMessage ?? resultState.errorMessage;
  const hasResult = Boolean(result.plainText || result.structuredNotes || result.todoList);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 text-center sm:px-8 lg:px-10">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-700">
              MVP · Handwriting to Notion
            </span>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Convert handwritten notes into content you can paste into Notion.
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Upload one handwritten image to extract the raw text, generate structured notes, and pull out
              action items you can copy into your next Notion page.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-slate-500">
            <span className="rounded-full border border-slate-200 px-3 py-1">Plain Text</span>
            <span className="rounded-full border border-slate-200 px-3 py-1">Structured Notes</span>
            <span className="rounded-full border border-slate-200 px-3 py-1">To-do List</span>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div className="space-y-6">
          <article className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm">
            <header className="mb-6 space-y-2">
              <h2 className="text-xl font-semibold">Upload</h2>
              <p className="text-sm leading-6 text-slate-500">
                Upload a single handwritten image to start. This MVP works best for clear notes, meeting pages,
                study sheets, and other simple handwritten layouts.
              </p>
            </header>

            <UploadPanel onParsed={handleParsed} onStatusChange={handleUploadStatusChange} />
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <header className="mb-4 space-y-2">
              <h2 className="text-xl font-semibold">Processing Status</h2>
              <p className="text-sm leading-6 text-slate-500">
                We show the current step here so you know whether the image is being prepared, recognized, or
                turned into a more usable Notion-ready format.
              </p>
            </header>

            <ProcessingStatus status={processingStatus} />

            <div className="mt-4">
              <OutputState errorMessage={outputErrorMessage} status={outputStatus} />
            </div>
          </article>
        </div>

        {hasResult ? (
          <OutputPanel result={result} />
        ) : (
          <aside className="space-y-4">
            <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">What you will get</h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-slate-600">
                <li>
                  <span className="font-medium text-slate-800">Plain Text:</span> a raw-text fallback when you want
                  to inspect what the OCR actually read.
                </li>
                <li>
                  <span className="font-medium text-slate-800">Structured Notes:</span> a cleaner note format that is
                  easier to paste into a Notion page.
                </li>
                <li>
                  <span className="font-medium text-slate-800">To-do List:</span> a checklist-style output for likely
                  next actions and tasks.
                </li>
              </ul>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
              <h2 className="font-semibold text-slate-900">Before you upload</h2>
              <ul className="mt-3 space-y-2 leading-6">
                <li>• Use one image at a time.</li>
                <li>• Clear handwriting and strong contrast work best.</li>
                <li>• Simple note pages work better than dense multi-column layouts.</li>
              </ul>
            </article>
          </aside>
        )}
      </section>
    </main>
  );
}
