import { UPLOAD_STATUS, type UploadStatus } from '@/features/upload/types/upload-status';

type OutputStateProps = {
  status: UploadStatus;
  errorMessage?: string | null;
};

function getStateCopy(status: UploadStatus, errorMessage?: string | null): { title: string; description: string } {
  switch (status) {
    case UPLOAD_STATUS.IDLE:
      return {
        title: 'No result yet',
        description: 'Upload one handwritten image to generate OCR text, structured notes, and a to-do list.'
      };
    case UPLOAD_STATUS.ERROR:
      return {
        title: 'Something went wrong',
        description: errorMessage ?? 'The upload or processing flow failed. Please try another image.'
      };
    case UPLOAD_STATUS.PROCESSING:
    case UPLOAD_STATUS.UPLOADING:
    case UPLOAD_STATUS.SELECTING:
      return {
        title: 'Result pending',
        description: 'The result area will be filled after the upload and processing steps are completed.'
      };
    default:
      return {
        title: 'Result ready',
        description: 'The latest OCR and structured output will appear here.'
      };
  }
}

export function OutputState({ status, errorMessage }: OutputStateProps): JSX.Element {
  const copy = getStateCopy(status, errorMessage);
  const isError = status === UPLOAD_STATUS.ERROR;

  return (
    <div
      className={
        isError
          ? 'rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900 shadow-sm'
          : 'rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-sm'
      }
    >
      <h2 className="text-base font-semibold">{copy.title}</h2>
      <p className="mt-2 leading-6">{copy.description}</p>
    </div>
  );
}
