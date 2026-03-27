'use client';

import { useState } from 'react';

type CopyButtonProps = {
  label: string;
  content: string;
};

export function CopyButton({ label, content }: CopyButtonProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
      type="button"
      onClick={handleCopy}
    >
      {copied ? 'Copied' : label}
    </button>
  );
}
