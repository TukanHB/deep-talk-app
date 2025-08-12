"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Brain, Globe, Star, Flame } from "lucide-react";
import FlagDropdownButton from "./FlagDropdownButton";
import { questionsByLanguage, type LanguageKey } from "../data";

/* ========= UI-Konfiguration ========= */
const languageConfig = [
  { key: "Englisch", label: "English", flag: "🇬🇧", button: "Shuffle" },
  { key: "Deutsch", label: "Deutsch", flag: "🇩🇪", button: "Mischen" },
  { key: "Spanisch", label: "Español", flag: "🇪🇸", button: "Mezclar" },
  { key: "Türkisch", label: "Türkçe", flag: "🇹🇷", button: "Karıştır" },
  { key: "Französisch", label: "Français", flag: "🇫🇷", button: "Mélanger" },
  { key: "Portugiesisch", label: "Português", flag: "🇵🇹", button: "Embaralhar" },
] as const;

const landingI18n: Record<LanguageKey, { title: string; subtitle: string; start: string }> = {
  Englisch: {
    title: "Welcome to Cogito",
    subtitle: "Vox Cogitationis – “The Voice of Thinking”. Enjoy your conversation.",
    start: "Start",
  },
  Deutsch: {
    title: "Herzlich willkommen bei Cogito",
    subtitle: "Vox Cogitationis – „Die Stimme des Denkens“. Viel Spaß bei eurer Unterhaltung.",
    start: "Los",
  },
  Spanisch: {
    title: "Bienvenidos a Cogito",
    subtitle: "Vox Cogitationis – «La voz del pensamiento». Disfruten de su conversación.",
    start: "Empezar",
  },
  Türkisch: {
    title: "Cogito'ya hoş geldiniz",
    subtitle: "Vox Cogitationis – “Düşüncenin Sesi”. Sohbetinizin tadını çıkarın.",
    start: "Başla",
  },
  Französisch: {
    title: "Bienvenue sur Cogito",
    subtitle: "Vox Cogitationis – « La voix de la pensée ». Bonne conversation !",
    start: "Commencer",
  },
  Portugiesisch: {
    title: "Bem-vindos ao Cogito",
    subtitle: "Vox Cogitationis – “A voz do pensamento”. Aproveitem a conversa.",
    start: "Começar",
  },
};

/* ========= Karten-Style & Icons (dezent) ========= */
const pastelCardClasses = [
  "from-amber-50 to-white border-amber-100",
  "from-rose-50 to-white border-rose-100",
  "from-sky-50 to-white border-sky-100",
  "from-emerald-50 to-white border-emerald-100",
  "from-violet-50 to-white border-violet-100",
  "from-lime-50 to-white border-lime-100",
];

const iconList = [
  <User key="ico1" className="w-5 h-5 inline-block mr-2 text-amber-500" />,
  <Flame key="ico2" className="w-5 h-5 inline-block mr-2 text-rose-500" />,
  <Heart key="ico3" className="w-5 h-5 inline-block mr-2 text-pink-500" />,
  <Star key="ico4" className="w-5 h-5 inline-block mr-2 text-sky-500" />,
  <Globe key="ico5" className="w-5 h-5 inline-block mr-2 text-emerald-500" />,
  <Brain key="ico6" className="w-5 h-5 inline-block mr-2 text-violet-500" />,
];

/* ========= Helper ========= */
const drawAllQuestions = (lang: LanguageKey) => {
  const map = questionsByLanguage[lang];
  const out: Record<string, string> = {};
  Object.keys(map).forEach((cat) => {
    const list = map[cat] || [];
    if (list.length) out[cat] = list[Math.floor(Math.random() * list.length)];
  });
  return out;
};

/* ========= Component ========= */
export default function DeepTalkApp() {
  // Standard-Sprache: Englisch
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>("Englisch");

  // Landing bis Start
  const [showLanding, setShowLanding] = useState(true);

  // Karten-State
  const [cardContent, setCardContent] = useState<Record<string, string> | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Nach Sprachwechsel: neu ziehen (wenn schon gestartet)
  useEffect(() => {
    if (!hasDrawn || showLanding) return;
    setIsFlipped(true);
    const t = setTimeout(() => {
      setCardContent(drawAllQuestions(selectedLanguage));
      setIsFlipped(false);
    }, 250);
    return () => clearTimeout(t);
  }, [selectedLanguage, hasDrawn, showLanding]);

  // Start-Handler: Landing ausblenden + sofort generieren
  const handleStart = () => {
    setShowLanding(false);
    const initial = drawAllQuestions(selectedLanguage);
    setCardContent(initial);
    setHasDrawn(true);
  };

  // Shuffle
  const handleShuffle = () => {
    setIsFlipped(true);
    setTimeout(() => {
      setCardContent(drawAllQuestions(selectedLanguage));
      setIsFlipped(false);
      setHasDrawn(true);
    }, 250);
  };

  const btnText = languageConfig.find((l) => l.key === selectedLanguage)?.button ?? "Shuffle";

  /* ========= Landing UI (responsive + safe areas) ========= */
  if (showLanding) {
    const t = landingI18n[selectedLanguage];
    return (
      <div
        className="min-h-[100dvh] w-full flex flex-col items-center justify-center px-5 text-center
        bg-gradient-to-b from-rose-50 via-orange-50 to-amber-50"
        style={{
          paddingTop: "max(env(safe-area-inset-top), 16px)",
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
        }}
      >
        {/* Flaggenwahl oben rechts */}
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
          <FlagDropdownButton
            language={selectedLanguage}
            setLanguage={(lang) => setSelectedLanguage(lang as LanguageKey)}
            languageConfig={languageConfig as any}
          />
        </div>

        <h1 className="font-bold tracking-tight text-[clamp(1.75rem,3vw,2.25rem)]">
          {t.title}
        </h1>
        <p className="text-slate-700 mt-3 max-w-[42rem] text-[clamp(1rem,1.6vw,1.125rem)]">
          {t.subtitle}
        </p>

        <button
          onClick={handleStart}
          className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3
            text-[clamp(0.95rem,1.5vw,1rem)] font-semibold bg-black text-white
            hover:opacity-90 transition shadow-lg"
          style={{ minHeight: 44 }}
        >
          {t.start}
        </button>
      </div>
    );
  }

  /* ========= Haupt-UI (responsive grid, safe areas) ========= */
  return (
    <div
      className="min-h-[100dvh] w-full flex flex-col items-center
      bg-gradient-to-b from-rose-50 via-orange-50 to-amber-50"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 16px)",
        paddingBottom: "max(env(safe-area-inset-bottom), 16px)",
      }}
    >
      {/* Top-Bar: links Shuffle, rechts Flag – mit responsive Abständen */}
      <div className="w-full max-w-5xl px-4 sm:px-6 md:px-8 flex items-center justify-between">
        <button
          onClick={handleShuffle}
          className="px-4 sm:px-5 py-3 rounded-xl bg-black text-white shadow hover:opacity-90 transition
            text-[clamp(0.9rem,1.5vw,1rem)]"
          style={{ minHeight: 44 }}
        >
          {btnText}
        </button>

        <div className="ml-3">
          <FlagDropdownButton
            language={selectedLanguage}
            setLanguage={(lang) => setSelectedLanguage(lang as LanguageKey)}
            languageConfig={languageConfig as any}
          />
        </div>
      </div>

      {/* Karten-Grid: 1 Spalte (Phone), 2 Spalten (Tablet/Desktop) */}
      <div className="w-full max-w-5xl px-4 sm:px-6 md:px-8 mt-5">
        <AnimatePresence>
          {cardContent && (
            <motion.div
              key={JSON.stringify(cardContent)}
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.99 }}
              transition={{ duration: 0.22 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
            >
              {Object.entries(cardContent).map(([category, question], idx) => (
                <div
                  key={category}
                  className={`p-4 sm:p-5 rounded-2xl border bg-white bg-gradient-to-br
                    ${pastelCardClasses[idx % pastelCardClasses.length]}
                    shadow-sm backdrop-blur`}
                >
                  <h2 className="font-semibold mb-2 flex items-center text-[clamp(1rem,1.6vw,1.125rem)]">
                    {iconList[idx % iconList.length]} {category}
                  </h2>
                  <p className="text-slate-800 leading-relaxed text-[clamp(0.95rem,1.4vw,1rem)]">
                    {question}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
