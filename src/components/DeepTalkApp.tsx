"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserCircle, Heart, Target, Handshake, ArrowLeft, Moon, Sun } from "lucide-react";
import questionsEN from "../data/questions.EN.json";
import questionsDE from "../data/questions.DE.json";
import questionsES from "../data/questions.ES.json";
import questionsTR from "../data/questions.TR.json";
import questionsFR from "../data/questions.FR.json";
import questionsPT from "../data/questions.PT.json";
import FlagDropdownButton from "./FlagDropdownButton";
import { questionsByLanguage } from "cogito-mobile/assets/questionsByLanguage";

// If you need to import JSON files, ensure your tsconfig.json has "resolveJsonModule": true and "esModuleInterop": true in compilerOptions.

/* =========================
   Types
========================= */
type LanguageKey =
  | "Englisch"
  | "Deutsch"
  | "Spanisch"
  | "Türkisch"
  | "Französisch"
  | "Portugiesisch";
type CategoryKey = "friendship" | "love" | "identity" | "goals";

type LanguageItem = {
  key: LanguageKey;
  label: string;
  flag: string;
  button: string; // nur für Kompatibilität, wird nicht genutzt
};

/* =========================
   Sprache: Start = Englisch
========================= */
const languageConfig: readonly LanguageItem[] = [
  { key: "Englisch", label: "English", flag: "🇬🇧", button: "" },
  { key: "Deutsch", label: "Deutsch", flag: "🇩🇪", button: "" },
  { key: "Spanisch", label: "Español", flag: "🇪🇸", button: "" },
  { key: "Türkisch", label: "Türkçe", flag: "🇹🇷", button: "" },
  { key: "Französisch", label: "Français", flag: "🇫🇷", button: "" },
  { key: "Portugiesisch", label: "Português", flag: "🇵🇹", button: "" },
] as const;

/* =========================
   Landing-Texte
========================= */
const landingText: Record<
  LanguageKey,
  { mainTitle: string; subTitle: string; description: string }
> = {
  Englisch: {
    mainTitle: "Welcome to Cogito!",
    subTitle: "Vox Cogitationis – The Voice of Thinking",
    description:
      "Choose a category and explore full-screen deep-talk questions — one per page with TikTok-style snap scroll.",
  },
  Deutsch: {
    mainTitle: "Willkommen bei Cogito!",
    subTitle: "Vox Cogitationis – Die Stimme des Denkens",
    description:
      "Wähle eine Kategorie und entdecke Deep-Talk-Fragen im Vollbild – eine pro Seite mit Snap-Scroll wie bei TikTok.",
  },
  Spanisch: {
    mainTitle: "¡Bienvenido a Cogito!",
    subTitle: "Vox Cogitationis – La voz del pensamiento",
    description:
      "Elige una categoría y explora preguntas de conversación profunda a pantalla completa: una por página con desplazamiento al estilo TikTok.",
  },
  Türkisch: {
    mainTitle: "Cogito'ya hoş geldin!",
    subTitle: "Vox Cogitationis – Düşüncenin Sesi",
    description:
      "Bir kategori seç ve tam ekran derin sohbet sorularını keşfet — TikTok tarzı, sayfa başına bir soru ve snap kaydırma.",
  },
  Französisch: {
    mainTitle: "Bienvenue sur Cogito !",
    subTitle: "Vox Cogitationis – La voix de la pensée",
    description:
      "Choisis une catégorie et découvre des questions de deep-talk en plein écran — une par page avec un défilement façon TikTok.",
  },
  Portugiesisch: {
    mainTitle: "Bem-vindo ao Cogito!",
    subTitle: "Vox Cogitationis – A Voz do Pensamento",
    description:
      "Escolhe uma categoria e explora perguntas de conversa profunda em ecrã inteiro — uma por página com deslocamento ao estilo TikTok.",
  },
};

/* =========================
   Kategorien: Aliase pro Sprache
   (für robustes Finden der Daten-Keys)
========================= */
const CATEGORY_ALIASES: Record<LanguageKey, Record<CategoryKey, string[]>> = {
  Englisch: {
    friendship: ["Friendship"],
    love: ["Love and Relationship", "Love & Relationship"],
    identity: ["Identity & Life", "Identity and Life"],
    goals: ["Goals and Society", "Goals & Society"],
  },
  Deutsch: {
    friendship: ["Freundschaft"],
    love: ["Liebe und Beziehung", "Liebe & Beziehung", "Liebe und Beziehungen"],
    identity: ["Identität & Leben", "Identität und Leben"],
    goals: ["Ziele und Gesellschaft", "Ziele & Gesellschaft", "Ziele ud Gesellschaft"],
  },
  Spanisch: {
    friendship: ["Amistad"],
    love: ["Amor y Relaciones", "Amor & Relaciones"],
    identity: ["Identidad y Vida"],
    goals: ["Metas y Sociedad"],
  },
  Türkisch: {
    friendship: ["Arkadaşlık", "Arkadaslik"],
    love: ["Aşk ve İlişkiler", "Ask ve Iliskiler"],
    identity: ["Kimlik ve Yaşam", "Kimlik ve yasam"],
    goals: ["Hedefler ve Toplum"],
  },
  Französisch: {
    friendship: ["Amitié", "Amitie"],
    love: ["Amour & Relations", "Amour et Relations"],
    identity: ["Identité & Vie", "Identite & Vie", "Identité et Vie"],
    goals: ["Objectifs & Société", "Objectifs et Société", "Objectifs & Societe"],
  },
  Portugiesisch: {
    friendship: ["Amizade"],
    love: ["Amor e Relacionamentos", "Amor & Relacionamentos"],
    identity: ["Identidade e Vida"],
    goals: ["Metas e Sociedade"],
  },
};

/* Anzeigename (erste Alias-Variante) */
function getLocalizedCategoryName(lang: LanguageKey, key: CategoryKey): string {
  const list = CATEGORY_ALIASES[lang]?.[key] ?? [];
  return list[0] ?? key;
}

/* Fragen einer Kategorie in einer Sprache holen (mit Aliases) */
function getQuestions(lang: LanguageKey, key: CategoryKey): string[] {
  const data = (questionsByLanguage as any)[lang] ?? {};
  const aliases = CATEGORY_ALIASES[lang]?.[key] ?? [];
  for (const alias of aliases) {
    const arr = data[alias];
    if (Array.isArray(arr)) return arr.slice(); // stabile Reihenfolge
  }
  return []; // nichts gefunden
}

/* =========================
   Icons & Farben
========================= */
const IconSize = 36;

function getCategoryIconByKey(key: CategoryKey) {
  switch (key) {
    case "friendship":
      return <Handshake size={IconSize} strokeWidth={2} className="icon icon--emerald" />;
    case "love":
      return <Heart size={IconSize} strokeWidth={2} className="icon icon--rose" />;
    case "identity":
      return <UserCircle size={IconSize} strokeWidth={2} className="icon icon--violet" />;
    case "goals":
    default:
      return <Target size={IconSize} strokeWidth={2} className="icon icon--amber" />;
  }
}

const CARD_BG_CLASSES: Record<CategoryKey, string> = {
  friendship: "card--emerald",
  love: "card--rose",
  identity: "card--violet",
  goals: "card--amber",
};

const CATEGORY_ORDER: CategoryKey[] = ["friendship", "love", "identity", "goals"];

/* =========================
   Component
========================= */
export default function DeepTalkApp() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>("Englisch");
  const [selectedKey, setSelectedKey] = useState<CategoryKey | null>(null);
  const [deck, setDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const observer = useRef<IntersectionObserver | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  // Hintergrund (dezent), Dark/Light
  const backgroundStyle =
    theme === "light"
      ? "linear-gradient(-45deg, #f3e3d5c4, #f5e4d2ff, #d8d9f6ff, #f3d6da)"
      : "linear-gradient(-45deg, #0f1012, #0a0b0d, #000000, #121316)";
  const textColor = theme === "dark" ? "#fff" : "#111";

  /* ===== Sprachwechsel: gleiche Kategorie + Index, Frage aus neuer Sprache ===== */
  useEffect(() => {
    if (!selectedKey) return;
    const newDeck = getQuestions(selectedLanguage, selectedKey);
    setDeck(newDeck);
    setCurrentIndex((prev) => (newDeck.length ? Math.min(prev, newDeck.length - 1) : 0));
    // Zum aktuellen Eintrag scrollen
    setTimeout(() => {
      const idx = Math.min(currentIndex, Math.max(0, newDeck.length - 1));
      document.getElementById(`q-${idx}`)?.scrollIntoView({ behavior: "smooth" });
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  /* ===== Kategorie auswählen ===== */
  const selectCategory = useCallback(
    (key: CategoryKey) => {
      setSelectedKey(key);
      const d = getQuestions(selectedLanguage, key);
      setDeck(d);
      setCurrentIndex(0);
      setTimeout(() => {
        document.getElementById("q-0")?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    },
    [selectedLanguage]
  );

  /* ===== Zurück ins Menü ===== */
  const goBackToMenu = useCallback(() => {
    setSelectedKey(null);
    setDeck([]);
    setCurrentIndex(0);
    categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /* ===== Nächste Frage beim Scrollen ===== */
  const showNext = useCallback(() => {
    if (!deck.length) return;
    setCurrentIndex((prev) => (prev + 1 < deck.length ? prev + 1 : prev)); // kein Wrap
  }, [deck.length]);

  const lastQuestionRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) showNext();
        },
        { threshold: 0.8 }
      );
      if (node) observer.current.observe(node);
    },
    [showNext]
  );

  // Kategorienanzeige: feste Reihenfolge, lokalisierter Name
  const localizedCategories = useMemo(
    () =>
      CATEGORY_ORDER.map((key) => ({
        key,
        title: getLocalizedCategoryName(selectedLanguage, key),
      })),
    [selectedLanguage]
  );
  const texts = landingText[selectedLanguage];

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        background: backgroundStyle,
        backgroundSize: "400% 400%",
        animation: "gradientMove 12s ease infinite",
        color: textColor,
        position: "relative",
      }}
    >
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* dezent: Vignette im Dark Mode */}
      {theme === "dark" && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(80% 60% at 50% 30%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.55) 100%)",
            zIndex: 0,
          }}
        />
      )}

      {/* Toolbar: Sprache + Theme */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          zIndex: 100,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <FlagDropdownButton
          language={selectedLanguage}
          setLanguage={setSelectedLanguage}
          languageConfig={languageConfig}
        />
        <button
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          style={{
            background: theme === "light" ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: 999,
            padding: "6px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: textColor,
            backdropFilter: "blur(6px)",
          }}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          <span style={{ fontSize: 12, fontWeight: 600 }}>
            {theme === "light" ? "Dark" : "Light"}
          </span>
        </button>
      </div>

      {/* Zurück ins Menü – optional */}
      {selectedKey && (
        <button
          onClick={goBackToMenu}
          style={{
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 10,
            background: "rgba(0,0,0,0.5)",
            border: "none",
            borderRadius: "8px",
            padding: "6px 10px",
            color: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <ArrowLeft size={18} /> Menu
        </button>
      )}

      {/* Landing */}
      <section
        className="shell shell--center"
        style={{ height: "100vh", scrollSnapAlign: "start" }}
      >
        <div>
          <h1 className="hero__title">{texts.mainTitle}</h1>
          <p style={{ margin: "8px 0", fontStyle: "italic", fontSize: "1.2rem" }}>
            {texts.subTitle}
          </p>
          <p style={{ fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto" }}>
            {texts.description}
          </p>
        </div>
      </section>

      {/* Kategorien (feste Reihenfolge, lokalisierte Titel) */}
      {!selectedKey ? (
        <section
          ref={categoriesRef}
          className="shell"
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <main className="grid" style={{ width: "100%" }}>
            <div className="grid__inner">
              {localizedCategories.map(({ key, title }) => {
                const Icon = getCategoryIconByKey(key);
                return (
                  <button
                    key={key}
                    className={`card ${CARD_BG_CLASSES[key]}`}
                    onClick={() => selectCategory(key)}
                    style={{ textAlign: "left", cursor: "pointer", width: "100%" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: `${IconSize + 6}px`,
                        }}
                      >
                        {Icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h2 className="card__title" style={{ margin: 0 }}>
                          {title}
                        </h2>
                        <p className="card__text">
                          {/* kurze Beschreibung je Sprache */}
                          {selectedLanguage === "Englisch" &&
                            `Prompts and questions about “${title}” — great for deeper conversations.`}
                          {selectedLanguage === "Deutsch" &&
                            `Fragen und Impulse rund um „${title}“ – ideal für tiefere Gespräche.`}
                          {selectedLanguage === "Spanisch" &&
                            `Preguntas e ideas sobre «${title}», perfectas para conversaciones más profundas.`}
                          {selectedLanguage === "Türkisch" &&
                            `“${title}” üzerine sorular ve düşünce kıvılcımları — derin sohbetler için ideal.`}
                          {selectedLanguage === "Französisch" &&
                            `Questions et inspirations autour de « ${title} » — parfait pour des échanges plus profonds.`}
                          {selectedLanguage === "Portugiesisch" &&
                            `Perguntas e ideias sobre “${title}” — ideal para conversas mais profundas.`}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </main>
        </section>
      ) : (
        /* Fragen-Viewer: gleiche Kategorie (Key) + gleicher Index; Frage aus neuer Sprache */
        <>
          {Array.from({ length: currentIndex + 1 }).map((_, i) => {
            const key = selectedKey!;
            const Icon = getCategoryIconByKey(key);
            const title = getLocalizedCategoryName(selectedLanguage, key);
            const question = deck.length ? deck[i] : "";
            const isLast = i === currentIndex;

            return (
              <section
                key={`q-${i}`}
                id={`q-${i}`}
                ref={isLast ? lastQuestionRef : null}
                style={{
                  height: "100vh",
                  scrollSnapAlign: "start",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                }}
              >
                <div
                  className={`card ${CARD_BG_CLASSES[key]}`}
                  style={{ width: "min(900px, 94%)" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: `${IconSize + 6}px`,
                      }}
                    >
                      {Icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 className="card__title" style={{ margin: 0 }}>
                        {title}
                      </h2>
                      <p className="card__text">{question}</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </>
      )}
    </div>
  );
}
