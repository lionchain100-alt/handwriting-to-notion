import type { OcrRawResult } from '@/features/handwriting/types/ocr-result';
import type { RestructureProvider } from '@/features/handwriting/types/provider';
import { RESULT_WARNING_CODE, type HandwritingResult, type ResultWarning } from '@/features/output/types/output-result';
import type { UploadScene } from '@/features/upload/types/upload-input';

function buildWarnings(input: OcrRawResult): ResultWarning[] {
  const warnings: ResultWarning[] = [];

  if (!input.text.trim()) {
    warnings.push({
      code: RESULT_WARNING_CODE.EMPTY_TEXT,
      message: 'No readable text was detected. Try another image or compare with the original note before pasting anything into Notion.'
    });
  }

  if (typeof input.confidence === 'number' && input.confidence > 0 && input.confidence < 60) {
    warnings.push({
      code: RESULT_WARNING_CODE.LOW_CONFIDENCE,
      message: 'This result may be unreliable. Review Plain Text first and double-check tasks before using the structured output.'
    });
  }

  return warnings;
}

function normalizeLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function toSentenceCase(line: string): string {
  if (!line) {
    return line;
  }

  return line.charAt(0).toUpperCase() + line.slice(1);
}

function stripListPrefix(line: string): string {
  return line.replace(/^[-*•\d.)\s]+/, '').trim();
}

function buildHeading(scene?: UploadScene): string {
  if (!scene) {
    return '# Notes';
  }

  return `# ${toSentenceCase(scene)} Notes`;
}

function toStructuredNotes(text: string, scene?: UploadScene): string {
  const lines = normalizeLines(text).map(stripListPrefix).filter(Boolean);

  if (lines.length === 0) {
    return '# Notes\n\n- No structured notes available.';
  }

  const heading = buildHeading(scene);
  const summaryLine = lines[0];
  const detailLines = lines.slice(1, 6);

  const sections: string[] = [heading];

  sections.push(`\n## Summary\n- ${toSentenceCase(summaryLine)}`);

  if (detailLines.length > 0) {
    sections.push('\n## Details');
    detailLines.forEach((line) => {
      sections.push(`- ${toSentenceCase(line)}`);
    });
  }

  return sections.join('\n');
}

function isLikelyActionItem(line: string): boolean {
  const lowerLine = line.toLowerCase();
  const actionPrefixes = [
    'todo',
    'to do',
    'follow up',
    'follow-up',
    'send',
    'share',
    'finish',
    'complete',
    'review',
    'fix',
    'call',
    'email',
    'prepare',
    'plan',
    'update',
    'write',
    'draft',
    'check'
  ];

  return actionPrefixes.some((prefix) => lowerLine.startsWith(prefix));
}

function toTodoList(text: string): string {
  const candidateLines = normalizeLines(text).map(stripListPrefix).filter(Boolean);

  if (candidateLines.length === 0) {
    return '- [ ] No action items extracted.';
  }

  const actionItems = candidateLines.filter(isLikelyActionItem);
  const selectedItems = (actionItems.length > 0 ? actionItems : candidateLines.slice(0, 3)).slice(0, 5);

  return selectedItems.map((line) => `- [ ] ${toSentenceCase(line)}`).join('\n');
}

export class BasicRestructureProvider implements RestructureProvider {
  async transform(input: OcrRawResult, scene?: UploadScene): Promise<HandwritingResult> {
    const plainText = input.text.trim();

    return {
      plainText,
      structuredNotes: toStructuredNotes(plainText, scene),
      todoList: toTodoList(plainText),
      warnings: buildWarnings(input)
    };
  }
}
