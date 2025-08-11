"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Brain, Globe, Star } from "lucide-react";
import FlagDropdownButton, { LanguageItem } from "./FlagDropdownButton";
import { categories } from "../data/questions";// <- ausgelagerte Fragen

/* ========= Sprachen / Buttontexte ========= */
const languageConfig: readonly LanguageItem[] = [
  { key: "Englisch",      label: "English",    flag: "🇬🇧", button: "Shuffle" },
  { key: "Deutsch",       label: "Deutsch",    flag: "🇩🇪", button: "Mischen" },
  { key: "Spanisch",      label: "Español",    flag: "🇪🇸", button: "Mezclar" },
  { key: "Türkisch",      label: "Türkçe",     flag: "🇹🇷", button: "Karıştır" },
  { key: "Französisch",   label: "Français",   flag: "🇫🇷", button: "Mélanger" },
  { key: "Portugiesisch", label: "Português",  flag: "🇵🇹", button: "Embaralhar" },
];

/* ========= Landing-Texte ========= */
const landingI18n: Record<string, { title: string; subtitle: string; start: string }> = {
  Englisch:     { title: "Welcome to Cogito", subtitle: "Vox Cogitationis – “The Voice of Thinking”. Enjoy your conversation.", start: "Start" },
  Deutsch:      { title: "Herzlich willkommen bei Cogito", subtitle: "Vox Cogitationis – „Die Stimme des Denkens“. Viel Spaß bei eurer Unterhaltung.", start: "Los" },
  Spanisch:     { title: "Bienvenidos a Cogito", subtitle: "Vox Cogitationis – « La voz del pensamiento ». Disfruten de su conversación.", start: "Empezar" },
  Türkisch:     { title: "Cogito'ya hoş geldiniz", subtitle: "Vox Cogitationis – “Düşüncenin Sesi”. Muhabbetnizin tadını çıkarın.", start: "Haydi Başla" },
  Französisch:  { title: "Bienvenue sur Cogito", subtitle: "Vox Cogitationis – « La voix de la pensée ». Bonne conversation !", start: "Commencer" },
  Portugiesisch:{ title: "Bem-vindos ao Cogito", subtitle: "Vox Cogitationis – “A voz do pensamento”. Aproveitem a conversa.", start: "Começar" },
};

/* ========= Stil-Helfer (erkennt die 4 Kategorien in allen Sprachen) ========= */
type StyleKey = "identityLife" | "loveRel" | "goalsSoc" | "friendship";

const styleKeyFor = (title: string): StyleKey => {
  const t = title.toLowerCase();
  if (
    t.includes("identity") || t.includes("identität") || t.includes("identidad") ||
    t.includes("kimlik") || t.includes("identité") || t.includes("identidade") ||
    t.includes("life") || t.includes("leben") || t.includes("vida") || t.includes("yaşam") || t.includes("vie")
  ) return "identityLife";

  if (
    t.includes("love") || t.includes("liebe") || t.includes("amor") ||
    t.includes("relationships") || t.includes("beziehungen") || t.includes("relaciones") ||
    t.includes("ilişkiler") || t.includes("relations") || t.includes("relacionamentos")
  ) return "loveRel";

  if (
    t.includes("goals") || t.includes("ziele") || t.includes("metas") ||
    t.includes("objectifs") || t.includes("hedefler") ||
    t.includes("society") || t.includes("gesellschaft") || t.includes("sociedad") ||
    t.includes("société") || t.includes("toplum") || t.includes("sociedade")
  ) return "goalsSoc";

  if (
    t.includes("friend") || t.includes("freund") || t.includes("amist") ||
    t.includes("arkadaş") || t.includes("amiti") || t.includes("amiz")
  ) return "friendship";

  return "identityLife";
};

const cardStyles: Record<StyleKey, { gradient: string; icon: JSX.Element; iconTone: string }> = {
  identityLife: { gradient: "bg-gradient-to-br from-white to-pink-50",   icon: <User className="w-5 h-5" />,  iconTone: "text-pink-500"   },
  loveRel:      { gradient: "bg-gradient-to-br from-white to-rose-50",   icon: <Heart className="w-5 h-5" />, iconTone: "text-rose-500"   },
  goalsSoc:     { gradient: "bg-gradient-to-br from-white to-sky-50",    icon: <Globe className="w-5 h-5" />, iconTone: "text-sky-500"    },
  friendship:   { gradient: "bg-gradient-to-br from-white to-emerald-50",icon: <Brain className="w-5 h-5" />, iconTone: "text-emerald-500"},
};

/* ========= Fragen ziehen (random je Kategorie) ========= */
const drawAllQuestions = async (langKey: string) => {
  const data = (categories as any)[langKey] as Record<string, string[]>;
  if (!data) return {};
  const result: Record<string, string> = {};
  Object.keys(data).forEach((cat) => {
    const list = data[cat] ?? [];
    if (list.length) {
      const q = list[Math.floor(Math.random() * list.length)];
      result[cat] = q;
    }
  });
  return result;
};

/* ========= Komponente ========= */
export default function DeepTalkApp() {
  const [selectedLanguage, setSelectedLanguage] = useState("Englisch");
  const [cardContent, setCardContent] = useState<Record<string, string> | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // bei Sprachwechsel neu ziehen, wenn bereits eine Runde angezeigt wird
  useEffect(() => {
    if (!hasDrawn) return;
    (async () => {
      setIsFlipped(true);
      const qs = await drawAllQuestions(selectedLanguage);
      setCardContent(qs);
      setIsFlipped(false);
    })();
  }, [selectedLanguage, hasDrawn]);

  const handleDrawAll = async () => {
    setIsFlipped(true);
    const qs = await drawAllQuestions(selectedLanguage);
    setCardContent(qs);
    setHasDrawn(true);
    setIsFlipped(false);
  };

  const startNow = async () => {
    setShowLanding(false);
    await handleDrawAll();
  };

  const btnText = languageConfig.find(l => l.key === selectedLanguage)?.button ?? "Shuffle";

  /* ========= Landing ========= */
  if (showLanding) {
    const t = landingI18n[selectedLanguage] ?? landingI18n.Englisch;
    return (
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-6">
        <div className="absolute top-3 right-3 z-20">
          <FlagDropdownButton language={selectedLanguage} setLanguage={setSelectedLanguage} languageConfig={languageConfig} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mt-3">{t.subtitle}</p>
        <button onClick={startNow} className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold bg-black text-white hover:opacity-90 transition shadow-lg">
          {t.start}
        </button>
      </div>
    );
  }

  /* ========= Haupt-UI – kompakt (Shuffle links, Flagge rechts) ========= */
  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-4">
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={handleDrawAll}
          className="px-4 py-2 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition shadow"
          aria-label={btnText}
        >
          {btnText}
        </button>
        <FlagDropdownButton language={selectedLanguage} setLanguage={setSelectedLanguage} languageConfig={languageConfig} />
      </div>

      {/* Kartenliste */}
      <div className="flex-1 min-h-0">
        <AnimatePresence mode="popLayout">
          {cardContent && (
            <motion.div
              key={JSON.stringify(cardContent)}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 overflow-y-auto pr-1"
              style={{ maxHeight: "calc(100vh - 140px)" }}
            >
              {Object.entries(cardContent).map(([category, question]) => {
                const k = styleKeyFor(category);
                const style = cardStyles[k];
                const Icon = React.cloneElement(style?.icon ?? <Star className="w-5 h-5" />, {
                  className: `w-5 h-5 ${style?.iconTone ?? "text-gray-500"}`,
                });
                return (
                  <div key={category} className={`rounded-2xl border border-white/40 shadow-sm backdrop-blur-sm ${style?.gradient ?? "bg-white"} p-4`}>
                    <h2 className="font-semibold text-base sm:text-lg mb-2 flex items-center gap-2">
                      {Icon} {category}
                    </h2>
                    <p className="text-sm sm:text-base leading-relaxed text-gray-800">{question}</p>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
