import { UPLOAD_STATUS, type UploadStatus } from '@/features/upload/types/upload-status';

type ProcessingStatusProps = {
  status: UploadStatus;
};

function getStatusTitle(status: UploadStatus): string {
  switch (status) {
    case UPLOAD_STATUS.IDLE:
      return 'Waiting for upload';
    case UPLOAD_STATUS.SELECTING:
      return 'Selecting image';
    case UPLOAD_STATUS.UPLOADING:
      return 'Uploading image';
    case UPLOAD_STATUS.PROCESSING:
      return 'Processing handwriting';
    case UPLOAD_STATUS.SUCCESS:
      return 'Processing completed';
    case UPLOAD_STATUS.ERROR:
      return 'Processing failed';
    default:
      return 'Waiting for upload';
  }
}

function getStatusDescription(status: UploadStatus): string {
  switch (status) {
    case UPLOAD_STATUS.IDLE:
      return 'Upload one handwritten image to start the MVP flow.';
    case UPLOAD_STATUS.SELECTING:
      return 'Preparing the selected image for validation and preview.';
    case UPLOAD_STATUS.UPLOADING:
      return 'Sending the image into the recognition pipeline.';
    case UPLOAD_STATUS.PROCESSING:
      return 'Running OCR and turning the result into structured notes.';
    case UPLOAD_STATUS.SUCCESS:
      return 'The image has been processed and the output is ready to review.';
    case UPLOAD_STATUS.ERROR:
      return 'Something went wrong during the upload or processing flow.';
    default:
      return 'Upload one handwritten image to start the MVP flow.';
  }
}

export function ProcessingStatus({ status }: ProcessingStatusProps): JSX.Element {
  return (
    <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
      <div className="space-y-2">
        <p className="font-semibold text-slate-900">{getStatusTitle(status)}</p>
        <p className="leading-6 text-slate-600">{getStatusDescription(status)}</p>
      </div>
    </div>
  );
}
