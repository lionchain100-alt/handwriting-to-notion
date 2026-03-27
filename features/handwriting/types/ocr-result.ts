export type OcrBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OcrConfidence = number;

export type OcrLine = {
  text: string;
  confidence?: OcrConfidence;
  bbox?: OcrBoundingBox;
};

export type OcrRawResult = {
  text: string;
  confidence?: OcrConfidence;
  lines?: OcrLine[];
};
