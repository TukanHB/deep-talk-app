"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Brain, Globe, Star, Flame } from "lucide-react";
import FlagDropdownButton, { type LanguageItem, type LanguageKey } from "./FlagDropdownButton";
import { questionsByLanguage } from "../data";

const languageConfig: readonly LanguageItem[] = [
  { key: "Englisch", label: "English",    flag: "🇬🇧", button: "Shuffle"   },
  { key: "Deutsch",  label: "Deutsch",    flag: "🇩🇪", button: "Mischen"   },
  { key: "Spanisch", label: "Español",    flag: "🇪🇸", button: "Mezclar"   },
  { key: "Türkisch", label: "Türkçe",     flag: "🇹🇷", button: "Karıştır"  },
  { key: "Französisch", label: "Français",flag: "🇫🇷", button: "Mélanger"  },
  { key: "Portugiesisch", label: "Português", flag: "🇵🇹", button: "Embaralhar" },
];

const landingI18n: Record<LanguageKey, { title: string; subtitle: string; start: string }> = {
  Englisch:     { title: "Welcome to Cogito", subtitle: "Vox Cogitationis – “The Voice of Thinking”. Enjoy your conversation.", start: "Start" },
  Deutsch:      { title: "Herzlich willkommen bei Cogito", subtitle: "Vox Cogitationis – „Die Stimme des Denkens“. Viel Spaß bei eurer Unterhaltung.", start: "Los" },
  Spanisch:     { title: "Bienvenidos a Cogito", subtitle: "Vox Cogitationis – « La voz del pensamiento ». Disfruten de su conversación.", start: "Empezar" },
  Türkisch:     { title: "Cogito'ya hoş geldiniz", subtitle: "Vox Cogitationis – “Düşüncenin Sesi”. Sohbetinizin tadını çıkarın.", start: "Başla" },
  Französisch:  { title: "Bienvenue sur Cogito", subtitle: "Vox Cogitationis – « La voix de la pensée ». Bonne conversation !", start: "Commencer" },
  Portugiesisch:{ title: "Bem-vindos ao Cogito", subtitle: "Vox Cogitationis – “A voz do pensamento”. Aproveitem a conversa.", start: "Começar" },
};

const cardBgClasses = [
  "card--amber", "card--rose", "card--sky", "card--emerald", "card--violet", "card--lime",
];

const iconList = [
  <User key="i1" size={18} className="icon icon--amber" />,
  <Flame key="i2" size={18} className="icon icon--rose" />,
  <Heart key="i3" size={18} className="icon icon--pink" />,
  <Star  key="i4" size={18} className="icon icon--sky" />,
  <Globe key="i5" size={18} className="icon icon--emerald" />,
  <Brain key="i6" size={18} className="icon icon--violet" />,
];

function drawAllQuestions(lang: LanguageKey) {
  const map = questionsByLanguage[lang];
  const out: Record<string, string> = {};
  Object.keys(map).forEach((cat) => {
    const list = map[cat] || [];
    if (list.length) out[cat] = list[Math.floor(Math.random() * list.length)];
  });
  return out;
}

export default function DeepTalkApp() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>("Englisch");
  const [showLanding, setShowLanding] = useState(true);
  const [cardContent, setCardContent] = useState<Record<string, string> | null>(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const handleStart = () => {
    setShowLanding(false);
    const initial = drawAllQuestions(selectedLanguage);
    setCardContent(initial);
    setHasDrawn(true);
  };

  useEffect(() => {
    if (!hasDrawn || showLanding) return;
    setCardContent(drawAllQuestions(selectedLanguage));
  }, [selectedLanguage, hasDrawn, showLanding]);

  const shuffle = () => setCardContent(drawAllQuestions(selectedLanguage));
  const btnText = languageConfig.find((l) => l.key === selectedLanguage)?.button ?? "Shuffle";
  const t = landingI18n[selectedLanguage];

  if (showLanding) {
    return (
      <div className="shell shell--center">
        <div className="topbar">
          <FlagDropdownButton
            language={selectedLanguage}
            setLanguage={(l) => setSelectedLanguage(l)}
            languageConfig={languageConfig}
          />
        </div>
        <h1 className="hero__title">{t.title}</h1>
        <p className="hero__subtitle">{t.subtitle}</p>
        <button className="btn btn--primary" onClick={handleStart}>{t.start}</button>
      </div>
    );
  }

  return (
    <div className="shell">
      <header className="header">
        <button className="btn btn--primary" onClick={shuffle}>{btnText}</button>
        <FlagDropdownButton
          language={selectedLanguage}
          setLanguage={(l) => setSelectedLanguage(l)}
          languageConfig={languageConfig}
        />
      </header>

      <main className="grid">
        <AnimatePresence>
          {cardContent && (
            <motion.div
              key={JSON.stringify(cardContent)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="grid__inner"
            >
              {Object.entries(cardContent).map(([category, question], idx) => (
                <div key={category} className={`card ${cardBgClasses[idx % cardBgClasses.length]}`}>
                  <h2 className="card__title">
                    <span className="card__icon">{iconList[idx % iconList.length]}</span>
                    {category}
                  </h2>
                  <p className="card__text">{question}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
