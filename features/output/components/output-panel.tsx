import { CopyButton } from '@/features/output/components/copy-button';
import {
  formatBulletListCopyContent,
  formatChecklistCopyContent,
  formatCopyContent,
  formatMarkdownCopyContent
} from '@/features/output/services/format-copy-content';
import { OUTPUT_MODE, type HandwritingResult } from '@/features/output/types/output-result';

type OutputPanelProps = {
  result: HandwritingResult;
};

const outputCards = [
  {
    key: 'plainText' as const,
    title: 'Plain Text',
    description: 'Best when you want to inspect the raw OCR output before trusting the formatted result.',
    mode: OUTPUT_MODE.PLAIN_TEXT
  },
  {
    key: 'structuredNotes' as const,
    title: 'Structured Notes',
    description: 'A cleaner note layout for pasting into a Notion page or meeting summary.',
    mode: OUTPUT_MODE.STRUCTURED_NOTES
  },
  {
    key: 'todoList' as const,
    title: 'To-do List',
    description: 'A checklist-style output for action items, follow-ups, and likely next steps.',
    mode: OUTPUT_MODE.TODO_LIST
  }
];

export function OutputPanel({ result }: OutputPanelProps): JSX.Element {
  return (
    <aside className="space-y-4">
      {outputCards.map((card) => (
        <article key={card.key} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{card.title}</h2>
              <p className="text-sm leading-6 text-slate-500">{card.description}</p>
            </div>
            <CopyButton content={formatCopyContent(result, card.mode)} label="Copy" />
          </div>
          <pre className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
            {result[card.key]}
          </pre>
        </article>
      ))}

      <article className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="space-y-3">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Copy for Notion</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Choose the copy format that best matches how you want to paste the result into Notion.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <CopyButton content={formatMarkdownCopyContent(result)} label="Copy Markdown" />
            <CopyButton content={formatBulletListCopyContent(result)} label="Copy Bullets" />
            <CopyButton content={formatChecklistCopyContent(result)} label="Copy Checklist" />
          </div>
        </div>
      </article>

      {result.warnings && result.warnings.length > 0 ? (
        <article className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 shadow-sm">
          <h2 className="font-semibold">Review before pasting</h2>
          <ul className="mt-3 space-y-2 leading-6">
            {result.warnings.map((warning) => (
              <li key={`${warning.code}-${warning.message}`}>{warning.message}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-6 text-amber-900/90">
            If the result looks uncertain, compare it with Plain Text first, then decide whether to paste the
            structured output into Notion.
          </p>
        </article>
      ) : null}
    </aside>
  );
}
