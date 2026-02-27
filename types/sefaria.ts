export type SefariaCalendarItem = {
  title: { en: string; he: string };
  displayValue: { en: string; he: string };
  ref: string;
  heRef: string;
  url: string;
  category: string;
  description?: { en: string; he: string };
};

export type SefariaCalendarResponse = {
  date: string;
  calendar_items: SefariaCalendarItem[];
};

export type SefariaTextVersion = {
  text: string[];
  language: string;
  versionTitle: string;
};

export type SefariaTextResponse = {
  ref: string;
  heRef: string;
  versions: SefariaTextVersion[];
};
