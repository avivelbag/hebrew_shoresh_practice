import { z } from "zod";

export const WordExampleSchema = z.object({
  word: z.string().describe("Word with nikud"),
  binyan: z
    .string()
    .describe(
      "Binyan: Pa'al, Nif'al, Pi'el, Pu'al, Hitpa'el, Hif'il, or Huf'al"
    ),
  translation: z.string().describe("English translation"),
});

export const PracticeProblemSchema = z.object({
  conjugatedWord: z
    .string()
    .describe("Conjugated Hebrew word with nikud"),
  options: z
    .array(z.string())
    .length(4)
    .describe("4 possible 3-letter roots"),
  correctAnswer: z
    .string()
    .describe("The correct root string (must be one of the options)"),
});

export const ShoreshEntrySchema = z.object({
  root: z.string().describe("3-letter root with dots, e.g. כ.ת.ב"),
  rootLetters: z.string().describe("Root letters only, e.g. כתב"),
  definition: z.string().describe("English definition"),
  examples: z.array(WordExampleSchema).min(2).max(4),
  practiceProblems: z.array(PracticeProblemSchema).min(3).max(5),
  sourceVerse: z
    .string()
    .describe("The pasuk this root appears in (with nikud)"),
  sourceRef: z
    .string()
    .describe("Citation, e.g. Exodus 27:20"),
});

export const WeeklyRootsSchema = z.object({
  roots: z.array(ShoreshEntrySchema).length(5),
});

export type ContentStatus = "draft" | "approved";

export const WeeklyContentSchema = z.object({
  parshaName: z.string(),
  parshaNameHe: z.string(),
  parshaRef: z.string(),
  weekOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  roots: z.array(ShoreshEntrySchema).length(5),
  status: z.enum(["draft", "approved"]),
  generatedAt: z.string().datetime(),
  approvedAt: z.string().datetime().optional(),
});

export type ShoreshEntry = z.infer<typeof ShoreshEntrySchema>;
export type WordExample = z.infer<typeof WordExampleSchema>;
export type PracticeProblem = z.infer<typeof PracticeProblemSchema>;
export type WeeklyContent = z.infer<typeof WeeklyContentSchema>;
