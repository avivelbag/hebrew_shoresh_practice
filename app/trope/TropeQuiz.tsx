"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import type { TropeMark } from "@/types/trope";
import { playTrope, stopAll } from "@/lib/audio/trope-player";

type QuizQuestion = {
  correct: TropeMark;
  options: TropeMark[];
};

function generateQuestions(
  motifs: TropeMark[],
  count: number
): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const shuffled = [...motifs].sort(() => Math.random() - 0.5);
    const correct = shuffled[i % shuffled.length];
    const distractors = shuffled
      .filter((m) => m.name !== correct.name)
      .slice(0, 3);
    const options = [correct, ...distractors].sort(
      () => Math.random() - 0.5
    );
    questions.push({ correct, options });
  }
  return questions;
}

type QuizState = "ready" | "listening" | "correct" | "incorrect" | "done";

export function TropeQuiz({ motifs }: { motifs: TropeMark[] }) {
  const questions = useMemo(() => generateQuestions(motifs, 10), [motifs]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<QuizState>("ready");
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const isProcessingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      stopAll();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const question = questions[currentIndex];

  const handleListen = useCallback(async () => {
    setState("listening");
    await playTrope(question.correct);
    setState("listening");
  }, [question]);

  function handleAnswer(selected: TropeMark) {
    if (isProcessingRef.current || state === "ready") return;
    isProcessingRef.current = true;
    setSelectedAnswer(selected.name);

    const isCorrect = selected.name === question.correct.name;
    if (isCorrect) {
      setScore((s) => s + 1);
      setState("correct");
    } else {
      setState("incorrect");
      // Play the correct answer when wrong
      playTrope(question.correct);
    }

    timeoutRef.current = setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        setState("done");
      } else {
        setCurrentIndex((i) => i + 1);
        setState("ready");
        setSelectedAnswer(null);
      }
      isProcessingRef.current = false;
    }, 1500);
  }

  function handleRestart() {
    setCurrentIndex(0);
    setState("ready");
    setScore(0);
    setSelectedAnswer(null);
    isProcessingRef.current = false;
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-zinc-200 p-8 text-center dark:border-zinc-700">
        <h2 className="mb-2 text-2xl font-bold">Practice Complete!</h2>
        <p className="text-4xl font-bold">
          {score}/{questions.length}
        </p>
        <p className="mt-2 text-zinc-500">
          {score >= 8
            ? "Excellent!"
            : score >= 5
              ? "Good work! Keep practicing."
              : "Keep practicing — you'll improve!"}
        </p>
        <button
          onClick={handleRestart}
          className="mt-4 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Identify the Trope
        </h2>
        <span className="text-sm text-zinc-400">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      <div className="mb-6 flex justify-center">
        <button
          onClick={handleListen}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-lg font-medium text-white transition-colors hover:bg-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
          {state === "ready" ? "Listen" : "Listen Again"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => {
          let buttonClass =
            "rounded-lg border-2 px-4 py-3 text-center transition-colors";

          if (state === "ready" || state === "listening") {
            buttonClass +=
              " border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:border-zinc-400 dark:hover:bg-zinc-800 cursor-pointer";
          } else if (option.name === question.correct.name) {
            buttonClass +=
              " border-green-500 bg-green-50 dark:bg-green-900/20";
          } else if (option.name === selectedAnswer) {
            buttonClass += " border-red-500 bg-red-50 dark:bg-red-900/20";
          } else {
            buttonClass +=
              " border-zinc-200 opacity-50 dark:border-zinc-600";
          }

          return (
            <button
              key={option.name}
              onClick={() => handleAnswer(option)}
              disabled={state === "ready" || state === "correct" || state === "incorrect"}
              className={buttonClass}
            >
              <span className="block text-2xl" dir="rtl" lang="he">
                {option.unicodeChar}
              </span>
              <span className="block text-sm font-medium">
                {option.name}
              </span>
              <span
                className="block text-xs text-zinc-500"
                dir="rtl"
                lang="he"
              >
                {option.nameHe}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
