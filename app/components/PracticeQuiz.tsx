"use client";

import { useState, useRef, useEffect } from "react";
import type { PracticeProblem } from "@/lib/schemas";

type QuizState = "answering" | "correct" | "incorrect" | "done";

export function PracticeQuiz({
  problems,
  rootLetters,
}: {
  problems: PracticeProblem[];
  rootLetters: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<QuizState>("answering");
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const isProcessingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (problems.length === 0) return null;

  const problem = problems[currentIndex];

  function handleAnswer(selected: string) {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;
    setSelectedAnswer(selected);

    const isCorrect = selected === problem.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
      setState("correct");
    } else {
      setState("incorrect");
    }

    timeoutRef.current = setTimeout(() => {
      if (currentIndex + 1 >= problems.length) {
        setState("done");
      } else {
        setCurrentIndex((i) => i + 1);
        setState("answering");
        setSelectedAnswer(null);
      }
      isProcessingRef.current = false;
    }, 1200);
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-zinc-200 p-6 text-center dark:border-zinc-700">
        <h3 className="mb-2 text-xl font-semibold">Practice Complete!</h3>
        <p className="text-3xl font-bold">
          {score}/{problems.length}
        </p>
        <p className="mt-2 text-zinc-500">
          Root: {rootLetters}
        </p>
        <button
          onClick={() => {
            setCurrentIndex(0);
            setState("answering");
            setScore(0);
            setSelectedAnswer(null);
            isProcessingRef.current = false;
          }}
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
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          Practice — Identify the Root
        </h3>
        <span className="text-sm text-zinc-400">
          {currentIndex + 1}/{problems.length}
        </span>
      </div>

      <p className="mb-1 text-sm text-zinc-500">
        What is the shoresh of this word?
      </p>
      <p
        dir="rtl"
        lang="he"
        className="mb-6 text-center text-4xl font-semibold"
      >
        {problem.conjugatedWord}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {problem.options.map((option) => {
          let buttonClass =
            "rounded-lg border-2 px-4 py-3 text-center text-xl font-medium transition-colors";

          if (state === "answering") {
            buttonClass +=
              " border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:border-zinc-400 dark:hover:bg-zinc-800 cursor-pointer";
          } else if (option === problem.correctAnswer) {
            buttonClass +=
              " border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400";
          } else if (option === selectedAnswer) {
            buttonClass +=
              " border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400";
          } else {
            buttonClass +=
              " border-zinc-200 opacity-50 dark:border-zinc-600";
          }

          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={state !== "answering"}
              dir="rtl"
              lang="he"
              className={buttonClass}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
