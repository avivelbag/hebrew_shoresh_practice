export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main className="flex max-w-2xl flex-col items-center gap-8 px-8 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Hebrew Root of the Day
        </h1>
        <p
          dir="rtl"
          lang="he"
          className="text-5xl font-semibold"
        >
          שֹׁרֶשׁ הַיּוֹם
        </p>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Learn Hebrew roots daily, tied to the weekly Torah portion.
        </p>
      </main>
    </div>
  );
}
