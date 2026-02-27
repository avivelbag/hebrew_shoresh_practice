export type TropeInterval = readonly [
  semitones: number,
  durationMultiplier: number,
];

export type TropeMark = {
  name: string;
  nameHe: string;
  unicodeChar: string;
  type: "disjunctive" | "conjunctive";
  intervals: readonly TropeInterval[];
};
