import type { WeeklyContent } from "@/lib/schemas";

export function ParshaHeader({
  content,
  dayIndex,
}: {
  content: WeeklyContent;
  dayIndex: number;
}) {
  const isShabbat = dayIndex === 6;
  const dayLabel = isShabbat
    ? "Shabbat Review"
    : `Day ${dayIndex === 0 ? 1 : dayIndex} of 5`;

  return (
    <header className="mb-8 text-center">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Hebrew Root of the Day
      </h1>
      <p
        dir="rtl"
        lang="he"
        className="mb-2 text-4xl font-semibold"
      >
        {content.parshaNameHe}
      </p>
      <p className="text-lg text-zinc-600 dark:text-zinc-400">
        Parashat {content.parshaName} — {dayLabel}
      </p>
      <p className="mt-1 text-sm text-zinc-400 dark:text-zinc-500">
        Week of {content.weekOf} · Content follows US Eastern time
      </p>
    </header>
  );
}
