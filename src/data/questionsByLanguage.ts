import questionsEN from "@/data/questions.EN.json";
import questionsDE from "@/data/questions.DE.json";
import questionsESRaw from "@/data/questions.ES.json";
import questionsFR from "@/data/questions.FR.json";
import questionsPT from "@/data/questions.PT.json";
import questionsTR from "@/data/questions.TR.json";

// Ensure questionsES is of type Record<string, string[]>
const questionsES: Record<string, string[]> = Array.isArray(questionsESRaw)
  ? { General: questionsESRaw as string[] }
  : questionsESRaw;

export const questionsByLanguage: Record<string, Record<string, string[]>> = {
  Englisch: questionsEN,
  Deutsch: questionsDE,
  Spanisch: questionsES,
  Französisch: questionsFR,
  Portugiesisch: questionsPT,
  Türkisch: questionsTR,
};
