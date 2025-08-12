// src/data/index.ts

// Einzelsprachen importieren (default imports)
import questionsDE from "./questionsDE";
import questionsEN from "./questionsEN";
import questionsES from "./questionsES";
import questionsTR from "./questionsTR";
import questionsFR from "./questionsFR";
import questionsPT from "./questionsPT";

// Sprach-Typen
export type LanguageKey =
  | "Deutsch"
  | "Englisch"
  | "Spanisch"
  | "Türkisch"
  | "Französisch"
  | "Portugiesisch";

export type CategoryMap = Record<string, string[]>;

// Mapping Sprache -> Kategorien/Fragen
export const questionsByLanguage: Record<LanguageKey, CategoryMap> = {
  Deutsch: questionsDE,
  Englisch: questionsEN,
  Spanisch: questionsES,
  Türkisch: questionsTR,
  Französisch: questionsFR,
  Portugiesisch: questionsPT,
};
