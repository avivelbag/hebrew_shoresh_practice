const CANTILLATION_RE = /[\u0591-\u05AF]/g;
const NIKUD_RE = /[\u05B0-\u05C7]/g;
const HTML_TAG_RE = /<[^>]*>/g;

export function stripCantillation(text: string): string {
  return text.replace(CANTILLATION_RE, "");
}

export function stripNikud(text: string): string {
  return text.replace(NIKUD_RE, "");
}

export function stripHtml(text: string): string {
  return text.replace(HTML_TAG_RE, "");
}

export function hasNikud(text: string): boolean {
  return /[\u05B0-\u05C7]/.test(text);
}

export function slugifyParsha(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
