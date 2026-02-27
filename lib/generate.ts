import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { getAnthropicClient } from "./anthropic";
import { fetchParshaText, getCurrentParsha, type ParshaInfo } from "./sefaria";
import { hasNikud, slugifyParsha } from "./hebrew-utils";
import { WeeklyRootsSchema, type WeeklyContent } from "./schemas";

const SYSTEM_PROMPT = `You are an expert in Biblical Hebrew linguistics and pedagogy.

TASK: Given Torah text from a parsha (with nikud), extract 5 pedagogically important Hebrew roots (shorashim) and generate educational content.

HEBREW TEXT REQUIREMENTS:
- All Hebrew words MUST include full nikud (nikkud/vowel points)
- Example words must show accurate nikud for their conjugation form
- Practice problem words must have nikud matching a real Hebrew conjugation

ROOT SELECTION CRITERIA:
- Choose roots that appear clearly in the provided text
- Prefer roots common in both Biblical and Modern Hebrew
- Include a mix of strong (שלמים) and weak (חסרי) roots when possible

PRACTICE PROBLEMS:
- The conjugated word must be a real Hebrew form with correct nikud
- The 3 wrong options must be plausible distractors (roots sharing 1-2 letters)
- correctAnswer must exactly match one of the options strings

Ensure all Hebrew text includes proper nikud (vowel points).`;

const MAX_VERSES = 50;

function validateNikud(content: WeeklyContent): string[] {
  const warnings: string[] = [];
  for (const root of content.roots) {
    if (!hasNikud(root.sourceVerse)) {
      warnings.push(`Source verse for root ${root.rootLetters} missing nikud`);
    }
    for (const example of root.examples) {
      if (!hasNikud(example.word)) {
        warnings.push(
          `Example word "${example.word}" for root ${root.rootLetters} missing nikud`
        );
      }
    }
    for (const problem of root.practiceProblems) {
      if (!hasNikud(problem.conjugatedWord)) {
        warnings.push(
          `Practice word "${problem.conjugatedWord}" for root ${root.rootLetters} missing nikud`
        );
      }
      if (!problem.options.includes(problem.correctAnswer)) {
        warnings.push(
          `correctAnswer "${problem.correctAnswer}" not in options for root ${root.rootLetters}`
        );
      }
    }
  }
  return warnings;
}

export type GenerationResult = {
  content: WeeklyContent;
  warnings: string[];
};

export async function generateWeeklyContent(
  parsha?: ParshaInfo
): Promise<GenerationResult> {
  const parshaInfo = parsha ?? (await getCurrentParsha());
  const verses = await fetchParshaText(parshaInfo.ref);
  const truncatedVerses = verses.slice(0, MAX_VERSES);

  const client = getAnthropicClient();
  const model = process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929";

  const message = await client.messages.parse({
    model,
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Here is the Torah text from Parashat ${parshaInfo.name} (${parshaInfo.ref}):\n\n${truncatedVerses.join("\n")}\n\nExtract 5 Hebrew roots and generate educational content as specified.`,
      },
    ],
    output_config: {
      format: zodOutputFormat(WeeklyRootsSchema),
    },
  });

  const parsed = message.parsed_output;
  if (!parsed) {
    throw new Error("Claude did not return structured output");
  }

  const now = new Date();
  // weekOf is the Sunday of the current week
  const dayOfWeek = now.getDay();
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - dayOfWeek);
  const weekOf = sunday.toISOString().split("T")[0];

  const content: WeeklyContent = {
    parshaName: parshaInfo.name,
    parshaNameHe: parshaInfo.nameHe,
    parshaRef: parshaInfo.ref,
    weekOf,
    roots: parsed.roots,
    status: "draft",
    generatedAt: now.toISOString(),
  };

  const warnings = validateNikud(content);

  return { content, warnings };
}

export function getRedisKey(parshaName: string, weekOf: string): string {
  return `content:${slugifyParsha(parshaName)}:${weekOf}`;
}
