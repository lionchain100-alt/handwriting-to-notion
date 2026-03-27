import { OUTPUT_MODE, type HandwritingResult, type OutputMode } from '@/features/output/types/output-result';

export function formatCopyContent(result: HandwritingResult, mode: OutputMode): string {
  switch (mode) {
    case OUTPUT_MODE.PLAIN_TEXT:
      return result.plainText;
    case OUTPUT_MODE.STRUCTURED_NOTES:
      return result.structuredNotes;
    case OUTPUT_MODE.TODO_LIST:
      return result.todoList;
    case OUTPUT_MODE.ALL:
      return [result.plainText, result.structuredNotes, result.todoList].join('\n\n');
    default:
      return result.structuredNotes;
  }
}

export function formatBulletListCopyContent(result: HandwritingResult): string {
  return result.structuredNotes;
}

export function formatChecklistCopyContent(result: HandwritingResult): string {
  return result.todoList;
}

export function formatMarkdownCopyContent(result: HandwritingResult): string {
  return result.structuredNotes;
}
