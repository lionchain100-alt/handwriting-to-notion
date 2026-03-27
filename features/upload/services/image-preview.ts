export function createImagePreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

export function revokeImagePreviewUrl(previewUrl: string): void {
  URL.revokeObjectURL(previewUrl);
}
