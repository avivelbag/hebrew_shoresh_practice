import Link from "next/link";

export function Navigation() {
  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          Shoresh
        </Link>
        <div className="flex gap-6">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Root of the Day
          </Link>
          <Link
            href="/trope"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Trope Practice
          </Link>
        </div>
      </div>
    </nav>
  );
}
