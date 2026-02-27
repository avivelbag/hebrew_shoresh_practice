import { getApprovedContent } from "@/lib/content-store";
import type { WeeklyContent, ShoreshEntry } from "@/lib/schemas";
import { ParshaHeader } from "./components/ParshaHeader";
import { ShoreshCard } from "./components/ShoreshCard";
import { PracticeQuiz } from "./components/PracticeQuiz";
import { ShabbatReview } from "./components/ShabbatReview";

export const revalidate = 86400; // 24-hour safety net; actual revalidation triggered by /api/admin/approve

const FALLBACK_ROOT: ShoreshEntry = {
  root: "כ.ת.ב",
  rootLetters: "כתב",
  definition: "to write",
  examples: [
    { word: "כָּתַב", binyan: "Pa'al", translation: "he wrote" },
    { word: "מִכְתָּב", binyan: "Pa'al", translation: "letter (correspondence)" },
    { word: "כְּתוּבָה", binyan: "Pa'al", translation: "marriage contract" },
  ],
  practiceProblems: [
    {
      conjugatedWord: "יִכְתֹּב",
      options: ["כתב", "כבד", "כרת", "כנס"],
      correctAnswer: "כתב",
    },
    {
      conjugatedWord: "נִכְתַּב",
      options: ["נכר", "כתב", "כבש", "נתב"],
      correctAnswer: "כתב",
    },
    {
      conjugatedWord: "הִכְתִּיב",
      options: ["כבד", "חתם", "כתב", "כרם"],
      correctAnswer: "כתב",
    },
  ],
  sourceVerse: "וַיִּכְתֹּב מֹשֶׁה אֵת כׇּל־דִּבְרֵי יְהוָה",
  sourceRef: "Exodus 24:4",
};

function getWeekOf(): string {
  // Use US Eastern time
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const dayOfWeek = now.getDay();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - dayOfWeek);
  return sunday.toISOString().split("T")[0];
}

function getDayIndex(): number {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  return now.getDay();
}

export default async function Home() {
  const weekOf = getWeekOf();
  const dayIndex = getDayIndex();
  let content: WeeklyContent | null = null;

  try {
    content = await getApprovedContent(weekOf);
  } catch {
    // Redis may not be configured yet — fall through to fallback
  }

  // Fallback when no content available
  if (!content) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Hebrew Root of the Day
          </h1>
          <p
            dir="rtl"
            lang="he"
            className="mb-2 text-4xl font-semibold"
          >
            שֹׁרֶשׁ הַיּוֹם
          </p>
          <p className="text-sm text-zinc-500">
            Sample root — new content coming soon!
          </p>
        </header>
        <ShoreshCard entry={FALLBACK_ROOT} />
        <div className="mt-6">
          <PracticeQuiz
            problems={FALLBACK_ROOT.practiceProblems}
            rootLetters={FALLBACK_ROOT.rootLetters}
          />
        </div>
      </div>
    );
  }

  const isShabbat = dayIndex === 6;
  // Map day of week to root index: Sun=0, Mon=1, Tue=2, Wed=3, Thu=4
  // Fri (5) shows Thursday's root (index 4), Sat (6) shows review
  const rootIndex = dayIndex >= 5 ? 4 : dayIndex;
  const todaysRoot = content.roots[rootIndex];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <ParshaHeader content={content} dayIndex={dayIndex} />

      {isShabbat ? (
        <ShabbatReview roots={content.roots} />
      ) : (
        <>
          <ShoreshCard entry={todaysRoot} />
          <div className="mt-6">
            <PracticeQuiz
              problems={todaysRoot.practiceProblems}
              rootLetters={todaysRoot.rootLetters}
            />
          </div>
        </>
      )}
    </div>
  );
}
