import type { UploadStatus } from '@/features/upload/types/upload-status';

export const UPLOAD_SCENE = {
  GENERAL: 'general',
  CLASS_NOTES: 'class-notes',
  MEETING_NOTES: 'meeting-notes',
  STICKY_NOTES: 'sticky-notes',
  WHITEBOARD: 'whiteboard'
} as const;

export type UploadScene = (typeof UPLOAD_SCENE)[keyof typeof UPLOAD_SCENE];

export type UploadImageInput = {
  file: File;
  previewUrl: string;
  mimeType: string;
  fileName: string;
  fileSize: number;
};

export type UploadRequest = {
  image: File;
  mode?: 'plain-text' | 'structured-notes' | 'todo-list' | 'all';
  scene?: UploadScene;
};

export type UploadState = {
  status: UploadStatus;
  image: UploadImageInput | null;
  errorMessage: string | null;
};
