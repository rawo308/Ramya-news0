import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ARABIC_TO_LATIN: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "a", "آ": "a", "ى": "a", "ة": "a",
  "ب": "b", "ت": "t", "ث": "th", "ج": "j", "ح": "h", "خ": "kh",
  "د": "d", "ذ": "th", "ر": "r", "ز": "z", "س": "s", "ش": "sh",
  "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh",
  "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n",
  "ه": "h", "و": "w", "ي": "y", "ء": "",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

function transliterateArabic(input: string) {
  return input
    .replace(/[ً-ٰٟ]/g, "") // strip Arabic diacritics (tashkeel)
    .replace(/[؀-ۿ]/g, (ch) => ARABIC_TO_LATIN[ch] ?? "");
}

export function slugify(input: string) {
  const slug = transliterateArabic(input)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `article-${Date.now()}`;
}
