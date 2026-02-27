import type { ShoreshEntry } from "@/lib/schemas";
import { ShoreshCard } from "./ShoreshCard";

export function ShabbatReview({ roots }: { roots: ShoreshEntry[] }) {
  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold">
        Shabbat Review — This Week&apos;s Roots
      </h2>
      <div className="space-y-6">
        {roots.map((root, i) => (
          <ShoreshCard key={i} entry={root} />
        ))}
      </div>
    </div>
  );
}
