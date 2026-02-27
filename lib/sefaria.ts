import type {
  SefariaCalendarResponse,
  SefariaCalendarItem,
  SefariaTextResponse,
} from "@/types/sefaria";
import { stripCantillation, stripHtml } from "./hebrew-utils";

const SEFARIA_BASE = "https://www.sefaria.org";

export type ParshaInfo = {
  name: string;
  nameHe: string;
  ref: string;
  url: string;
};

export async function getCurrentParsha(
  diaspora = 1
): Promise<ParshaInfo> {
  const res = await fetch(
    `${SEFARIA_BASE}/api/calendars?diaspora=${diaspora}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) {
    throw new Error(`Sefaria calendars API error: ${res.status}`);
  }
  const data: SefariaCalendarResponse = await res.json();

  const parsha = data.calendar_items.find(
    (item: SefariaCalendarItem) => item.title.en === "Parashat Hashavua"
  );
  if (!parsha) {
    throw new Error("Parashat Hashavua not found in Sefaria calendar");
  }

  return {
    name: parsha.displayValue.en,
    nameHe: parsha.displayValue.he,
    ref: parsha.ref,
    url: parsha.url,
  };
}

export async function fetchParshaText(ref: string): Promise<string[]> {
  const encodedRef = encodeURIComponent(ref);
  const res = await fetch(
    `${SEFARIA_BASE}/api/v3/texts/${encodedRef}?version=hebrew|Tanach with Ta'amei Hamikra`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) {
    throw new Error(`Sefaria text API error: ${res.status}`);
  }
  const data: SefariaTextResponse = await res.json();

  const hebrewVersion = data.versions.find(
    (v) => v.language === "he"
  );
  if (!hebrewVersion) {
    throw new Error(`No Hebrew text found for ${ref}`);
  }

  // Strip HTML tags, keep nikud, strip cantillation marks
  return hebrewVersion.text.map((verse) =>
    stripCantillation(stripHtml(verse)).normalize("NFC")
  );
}
