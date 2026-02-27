"use client";

import type { TropeMark } from "@/types/trope";
import { playTrope } from "@/lib/audio/trope-player";

export function TropeReference({ motifs }: { motifs: TropeMark[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Trope Reference</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {motifs.map((motif) => (
          <button
            key={motif.name}
            onClick={() => playTrope(motif)}
            className="flex items-center gap-4 rounded-lg border border-zinc-200 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            <span className="text-3xl" dir="rtl" lang="he">
              {motif.unicodeChar}
            </span>
            <div>
              <span className="block font-medium">{motif.name}</span>
              <span
                className="block text-sm text-zinc-500"
                dir="rtl"
                lang="he"
              >
                {motif.nameHe}
              </span>
              <span className="text-xs text-zinc-400">
                {motif.type}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
