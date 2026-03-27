export const UPLOAD_STATUS = {
  IDLE: 'idle',
  SELECTING: 'selecting',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

export type UploadStatus = (typeof UPLOAD_STATUS)[keyof typeof UPLOAD_STATUS];

export function isTerminalUploadStatus(status: UploadStatus): boolean {
  return status === UPLOAD_STATUS.SUCCESS || status === UPLOAD_STATUS.ERROR;
}
