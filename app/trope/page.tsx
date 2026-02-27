import type { Metadata } from "next";
import { tropeMotifs } from "@/lib/audio/trope-data";
import { TropeQuiz } from "./TropeQuiz";
import { TropeReference } from "./TropeReference";

export const metadata: Metadata = {
  title: "Trope Practice — Hebrew Root of the Day",
  description:
    "Practice identifying cantillation marks (trope) by listening to synthesized Ashkenazi melodies.",
};

export default function TropePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Trope Practice
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Listen to the melody and identify the cantillation mark.
          Ashkenazi tradition.
        </p>
      </header>

      <div className="mb-12">
        <TropeQuiz motifs={tropeMotifs} />
      </div>

      <TropeReference motifs={tropeMotifs} />
    </div>
  );
}
