import type { ShoreshEntry } from "@/lib/schemas";
import { stripNikud } from "@/lib/hebrew-utils";

export function ShoreshCard({ entry }: { entry: ShoreshEntry }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
      <div className="mb-4 flex flex-col items-center gap-2 sm:flex-row sm:items-baseline sm:gap-4">
        <span
          dir="rtl"
          lang="he"
          className="text-5xl font-bold"
        >
          {entry.root}
        </span>
        <span className="text-xl text-zinc-600 dark:text-zinc-400">
          {entry.definition}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Examples
        </h3>
        <ul className="space-y-2">
          {entry.examples.map((ex, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span
                dir="rtl"
                lang="he"
                className="text-2xl font-medium"
              >
                {ex.word}
              </span>
              <span className="text-sm text-zinc-500">
                {stripNikud(ex.word)}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {ex.translation}
              </span>
              <span className="text-xs text-zinc-400">({ex.binyan})</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm text-zinc-500">
        <span className="font-medium">Source:</span> {entry.sourceRef}
      </p>
      <p
        dir="rtl"
        lang="he"
        className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
      >
        {entry.sourceVerse}
      </p>
    </div>
  );
}
