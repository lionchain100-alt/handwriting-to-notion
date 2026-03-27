export const OUTPUT_MODE = {
  PLAIN_TEXT: 'plain-text',
  STRUCTURED_NOTES: 'structured-notes',
  TODO_LIST: 'todo-list',
  ALL: 'all'
} as const;

export type OutputMode = (typeof OUTPUT_MODE)[keyof typeof OUTPUT_MODE];

export const RESULT_WARNING_CODE = {
  LOW_CONFIDENCE: 'low-confidence',
  EMPTY_TEXT: 'empty-text',
  PARTIAL_RESULT: 'partial-result',
  IMAGE_QUALITY_LOW: 'image-quality-low'
} as const;

export type ResultWarningCode = (typeof RESULT_WARNING_CODE)[keyof typeof RESULT_WARNING_CODE];

export type ResultWarning = {
  code: ResultWarningCode;
  message: string;
};

export type HandwritingResult = {
  plainText: string;
  structuredNotes: string;
  todoList: string;
  warnings?: ResultWarning[];
};
