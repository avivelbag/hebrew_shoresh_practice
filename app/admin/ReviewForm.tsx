"use client";

import { useState } from "react";
import type { WeeklyContent, ShoreshEntry } from "@/lib/schemas";
import { slugifyParsha } from "@/lib/hebrew-utils";

function ShoreshPreview({ entry }: { entry: ShoreshEntry }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="mb-2 flex items-baseline gap-4">
        <span dir="rtl" lang="he" className="text-3xl font-bold">
          {entry.root}
        </span>
        <span className="text-lg text-zinc-600 dark:text-zinc-400">
          {entry.definition}
        </span>
      </div>
      <p className="mb-2 text-sm text-zinc-500">
        Source: {entry.sourceRef}
      </p>
      <div className="mb-3">
        <h4 className="mb-1 text-sm font-semibold">Examples:</h4>
        <ul className="space-y-1">
          {entry.examples.map((ex, i) => (
            <li key={i} className="text-sm">
              <span dir="rtl" lang="he" className="font-medium">
                {ex.word}
              </span>{" "}
              — {ex.translation} ({ex.binyan})
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="mb-1 text-sm font-semibold">
          Practice Problems ({entry.practiceProblems.length}):
        </h4>
        <ul className="space-y-1">
          {entry.practiceProblems.map((p, i) => (
            <li key={i} className="text-sm">
              <span dir="rtl" lang="he">
                {p.conjugatedWord}
              </span>{" "}
              — Answer: {p.correctAnswer}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ReviewForm() {
  const [password, setPassword] = useState("");
  const [drafts, setDrafts] = useState<WeeklyContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const headers = {
    Authorization: `Bearer ${password}`,
    "Content-Type": "application/json",
  };

  async function loadDrafts() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/content", { headers });
      if (!res.ok) {
        setMessage(res.status === 401 ? "Invalid password" : "Error loading drafts");
        return;
      }
      const data = await res.json();
      setDrafts(data.drafts);
      if (data.drafts.length === 0) {
        setMessage("No drafts available");
      }
    } catch {
      setMessage("Failed to connect");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate() {
    setLoading(true);
    setMessage("Generating content (this may take up to 60 seconds)...");
    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers,
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
        return;
      }
      setMessage(
        `Generated content for ${data.parshaName} (week of ${data.weekOf})` +
          (data.warnings?.length
            ? `\nWarnings: ${data.warnings.join(", ")}`
            : "")
      );
      await loadDrafts();
    } catch {
      setMessage("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(content: WeeklyContent) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers,
        body: JSON.stringify({
          parshaSlug: slugifyParsha(content.parshaName),
          weekOf: content.weekOf,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setMessage(`Error: ${data.error}`);
        return;
      }
      setMessage(`Approved content for ${content.parshaName}`);
      await loadDrafts();
    } catch {
      setMessage("Approval failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end gap-4">
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium"
          >
            Admin Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            placeholder="Enter admin password"
          />
        </div>
        <button
          onClick={loadDrafts}
          disabled={loading || !password}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Load Drafts
        </button>
        <button
          onClick={handleGenerate}
          disabled={loading || !password}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          Generate New
        </button>
      </div>

      {message && (
        <p className="whitespace-pre-wrap rounded-md bg-zinc-100 p-3 text-sm dark:bg-zinc-800">
          {message}
        </p>
      )}

      {drafts.map((draft) => (
        <div
          key={`${draft.parshaName}-${draft.weekOf}`}
          className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {draft.parshaName}{" "}
                <span dir="rtl" lang="he">
                  ({draft.parshaNameHe})
                </span>
              </h2>
              <p className="text-sm text-zinc-500">
                Week of {draft.weekOf} — Generated{" "}
                {new Date(draft.generatedAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleApprove(draft)}
              disabled={loading}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500 disabled:opacity-50"
            >
              Approve
            </button>
          </div>

          <div className="space-y-4">
            {draft.roots.map((root, i) => (
              <ShoreshPreview key={i} entry={root} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
