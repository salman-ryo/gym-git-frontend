'use client';

import React, { useState } from 'react';
import { Copy, Check, Code } from 'lucide-react';

interface AdminJsonViewerProps {
  data: unknown;
  title?: string;
  maxHeight?: string;
}

export function AdminJsonViewer({
  data,
  title = 'Raw Payload Inspector',
  maxHeight = 'max-h-96',
}: AdminJsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const formattedJson = JSON.stringify(data, null, 2) || '{}';

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden shadow-inner font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-zinc-400">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-neon-cyan" />
          <span className="font-semibold text-zinc-300 tracking-wider text-[11px] uppercase">
            {title}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors text-[11px] font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <pre
        className={`p-4 overflow-auto text-zinc-300 leading-relaxed scrollbar-thin scrollbar-thumb-zinc-800 ${maxHeight}`}
      >
        <code>{formattedJson}</code>
      </pre>
    </div>
  );
}

export default AdminJsonViewer;

