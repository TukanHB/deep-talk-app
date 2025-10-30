import EN from "./questions.EN.json";
import DE from "./questions.DE.json";
import ES from "./questions.ES.json";
import FR from "./questions.FR.json";
import PT from "./questions.PT.json";
import TR from "./questions.TR.json";

export const questionsByLanguage: Record<string, Record<string, string[]>> = {
  English: EN,
  Deutsch: DE,
  Español: ES,
  Français: FR,
  Português: PT,
  Türkçe: TR,
};
