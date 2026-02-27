import type { TropeMark } from "@/types/trope";

// Ashkenazi trope motifs — 8 most common cantillation marks
// Intervals are [semitones from D4 tonic, duration multiplier]
// Transcribed from Ashkenazi Torah reading tradition references:
// - Chabad.org Torah Reading Trop recordings
// - Temple Israel of Natick Torah Trope Music Notation PDF

export const tropeMotifs: TropeMark[] = [
  {
    name: "Sof Pasuk",
    nameHe: "סוֹף פָּסוּק",
    unicodeChar: "\u05C3", // ׃
    type: "disjunctive",
    intervals: [
      [0, 1],
      [-2, 1],
      [-4, 1.5],
      [-2, 0.5],
      [-4, 2],
    ],
  },
  {
    name: "Etnachta",
    nameHe: "אֶתְנַחְתָּא",
    unicodeChar: "\u0591", // ֑
    type: "disjunctive",
    intervals: [
      [0, 1],
      [2, 1],
      [0, 1],
      [-2, 1],
      [-4, 2],
    ],
  },
  {
    name: "Tipcha",
    nameHe: "טִפְחָא",
    unicodeChar: "\u0596", // ֖
    type: "disjunctive",
    intervals: [
      [0, 1],
      [-1, 1],
      [-3, 1.5],
    ],
  },
  {
    name: "Merkha",
    nameHe: "מֵרְכָא",
    unicodeChar: "\u05A5", // ֥
    type: "conjunctive",
    intervals: [
      [0, 1],
      [2, 1],
      [0, 1.5],
    ],
  },
  {
    name: "Munach",
    nameHe: "מוּנַח",
    unicodeChar: "\u05A3", // ֣
    type: "conjunctive",
    intervals: [
      [0, 1.5],
      [-2, 1],
      [0, 1],
    ],
  },
  {
    name: "Zakef Katan",
    nameHe: "זָקֵף קָטָן",
    unicodeChar: "\u0594", // ֔
    type: "disjunctive",
    intervals: [
      [0, 0.5],
      [2, 0.5],
      [4, 1],
      [2, 1],
      [0, 1.5],
    ],
  },
  {
    name: "Pashta",
    nameHe: "פַּשְׁטָא",
    unicodeChar: "\u0599", // ֙
    type: "disjunctive",
    intervals: [
      [4, 1],
      [2, 1],
      [0, 1],
      [-2, 1.5],
    ],
  },
  {
    name: "Revia",
    nameHe: "רְבִיעִי",
    unicodeChar: "\u0597", // ֗
    type: "disjunctive",
    intervals: [
      [0, 0.5],
      [3, 1],
      [5, 1],
      [3, 1],
      [0, 1.5],
    ],
  },
];
