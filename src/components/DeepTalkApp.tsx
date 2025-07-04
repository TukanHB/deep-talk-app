"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Brain, Globe, Star, Flame, Check } from "lucide-react";

// Kategorien und Beispiel-Fragen
const categories = {
  "Identität & Selbstbild": [
    "Wer bist du, wenn niemand hinsieht?",
    "Welche drei Worte beschreiben dich am besten – und warum?",
    "Wenn du dich neu erfinden könntest – was würdest du anders machen?",
  ],
  "Leben & Tod": [
    "Was bedeutet es für dich, wirklich zu leben?",
    "Was würdest du tun, wenn du nur noch ein Jahr zu leben hättest?",
    "Glaubst du, dass alles im Leben einen Sinn hat?",
  ],
  "Beziehungen & Liebe": [
    "Was bedeutet Liebe für dich – jenseits von Romantik?",
    "Was macht eine Beziehung für dich wirklich tief und bedeutungsvoll?",
    "Glaubst du an ‚die eine wahre Liebe‘?",
  ],
  "Ziele & Sinn": [
    "Was gibt deinem Leben aktuell Sinn?",
    "Verfolgst du deine eigenen Ziele – oder die Erwartungen anderer?",
    "Was würdest du tun, wenn Geld keine Rolle spielen würde?",
  ],
  "Gesellschaft & Menschheit": [
    "Was denkst du, ist das größte Problem unserer heutigen Gesellschaft?",
    "In welcher Welt würdest du gerne leben – und was müsste sich dafür ändern?",
    "Glaubst du, der Mensch ist im Kern gut oder schlecht?",
  ],
  "Liebe & Sexualität": [
    "Was bedeutet Sexualität für dich jenseits von körperlicher Lust?",
    "Kann man Intimität ohne Sex erleben – oder Sex ohne Intimität?",
    "Wie hat sich deine Sicht auf Sexualität mit der Zeit verändert?",
  ],
};

// Farben für die Kategorien
const categoryColors = {
  "Identität & Selbstbild": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Leben & Tod": "bg-red-100 text-red-800 border-red-300",
  "Beziehungen & Liebe": "bg-pink-100 text-pink-800 border-pink-300",
  "Ziele & Sinn": "bg-blue-100 text-blue-800 border-blue-300",
  "Gesellschaft & Menschheit": "bg-green-100 text-green-800 border-green-300",
  "Liebe & Sexualität": "bg-purple-100 text-purple-800 border-purple-300",
};

// Icons für die Kategorien
const categoryIcons = {
  "Identität & Selbstbild": <User className="w-5 h-5 inline-block mr-2 text-yellow-600" />,
  "Leben & Tod": <Flame className="w-5 h-5 inline-block mr-2 text-red-600" />,
  "Beziehungen & Liebe": <Heart className="w-5 h-5 inline-block mr-2 text-pink-600" />,
  "Ziele & Sinn": <Star className="w-5 h-5 inline-block mr-2 text-blue-600" />,
  "Gesellschaft & Menschheit": <Globe className="w-5 h-5 inline-block mr-2 text-green-600" />,
  "Liebe & Sexualität": <Brain className="w-5 h-5 inline-block mr-2 text-purple-600" />,
};

// Sprachauswahl
const languages = [
  "Deutsch",
  "Englisch",
  "Französisch",
  "Spanisch",
  "Portugiesisch",
  "Türkisch",
];

// KI-Fragen ziehen
const drawAllQuestions = async (filter: string[] | null = null, lang = "Deutsch") => {
  const randomQuestions: Record<string, string> = {};
  for (const category in categories) {
    if (!filter || filter.includes(category)) {
      try {
        const res = await fetch(
          `/api/question?category=${encodeURIComponent(category)}&lang=${encodeURIComponent(lang)}`
        );
        if (res.ok) {
          const data = await res.json();
          randomQuestions[category] = data.question;
          continue;
        }
      } catch (e) {
        // Fallback auf lokale Fragenliste
      }
      const list = categories[category];
      const random = list[Math.floor(Math.random() * list.length)];
      randomQuestions[category] = random;
    }
  }
  return randomQuestions;
};

export default function DeepTalkApp() {
  const [cardContent, setCardContent] = useState<Record<string, string> | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [enabledCategories, setEnabledCategories] = useState<string[]>(() => Object.keys(categories));
  const [language, setLanguage] = useState<string>("Deutsch");

  const toggleCategory = (category: string) => {
    setEnabledCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleDrawAll = () => {
    setIsFlipped(true);
    setTimeout(async () => {
      setCardContent(await drawAllQuestions(enabledCategories, language));
      setIsFlipped(false);
    }, 400);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 flex flex-col items-center space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-center">Deep Talk – Fragen aus allen Kategorien</h1>

      <div className="absolute top-2 right-2">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {Object.keys(categories).map((category) => {
          const isActive = enabledCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center gap-1 transition ${
                isActive
                  ? `${categoryColors[category]} border-opacity-100`
                  : "bg-gray-200 text-gray-500 border-gray-300"
              }`}
            >
              {isActive && <Check className="w-4 h-4" />} {category}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleDrawAll}
        className="px-6 py-2 bg-black text-white rounded-full text-lg hover:bg-gray-800 transition"
      >
        Karte mit ausgewählten Kategorien ziehen
      </button>

      <div className="perspective-1000 w-full max-w-3xl">
        <div
          className={`transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <AnimatePresence>
            {cardContent && (
              <motion.div
                key={JSON.stringify(cardContent)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="rounded-[1.25rem] shadow-2xl border border-gray-300 bg-white p-6 sm:p-10 space-y-6 backface-hidden"
              >
                {Object.entries(cardContent).map(([category, question]) => (
                  <div
                    key={category}
                    className={`p-4 sm:p-5 rounded-xl border ${
                      categoryColors[category] || "bg-gray-200 text-gray-800 border-gray-300"
                    }`}
                  >
                    <h2 className="font-semibold text-lg sm:text-xl mb-2 flex items-center">
                      {categoryIcons[category]} {category}
                    </h2>
                    <p className="text-base sm:text-lg leading-relaxed">{question}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
