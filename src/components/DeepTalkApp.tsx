"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UserCircle, Heart, Target, Handshake, ArrowLeft, Moon, Sun } from "lucide-react";
import { questionsByLanguage } from "../data";
import FlagDropdownButton from "./FlagDropdownButton";

// Define LanguageItem as a TypeScript type
type LanguageItem = {
  key: LanguageKey;
  label: string;
  flag: string;
  button: string;
};

// Define LanguageKey as a type alias for the supported languages
type LanguageKey = "Englisch" | "Deutsch" | "Spanisch" | "Türkisch" | "Französisch" | "Portugiesisch";

/* ===== Sprachen ===== */
const languageConfig: readonly LanguageItem[] = [
  { key: "Englisch", label: "English", flag: "🇬🇧", button: "" },
  { key: "Deutsch", label: "Deutsch", flag: "🇩🇪", button: "" },
  { key: "Spanisch", label: "Español", flag: "🇪🇸", button: "" },
  { key: "Türkisch", label: "Türkçe", flag: "🇹🇷", button: "" },
  { key: "Französisch", label: "Français", flag: "🇫🇷", button: "" },
  { key: "Portugiesisch", label: "Português", flag: "🇵🇹", button: "" },
] as const;

/* ===== Landing-Texte ===== */
const landingText: Record<LanguageKey, { mainTitle: string; subTitle: string; description: string }> = {
  Englisch: {
    mainTitle: "Welcome to Cogito!",
    subTitle: "Vox Cogitationis – The Voice of Thinking",
    description: "Choose a category and explore full-screen deep-talk questions — one per page with TikTok-style snap scroll.",
  },
  Deutsch: {
    mainTitle: "Willkommen bei Cogito!",
    subTitle: "Vox Cogitationis – Die Stimme des Denkens",
    description: "Wähle eine Kategorie und entdecke Deep-Talk-Fragen im Vollbild – eine pro Seite mit Snap-Scroll wie bei TikTok.",
  },
  Spanisch: {
    mainTitle: "¡Bienvenido a Cogito!",
    subTitle: "Vox Cogitationis – La voz del pensamiento",
    description: "Elige una categoría y explora preguntas de conversación profunda a pantalla completa: una por página con desplazamiento al estilo TikTok.",
  },
  Türkisch: {
    mainTitle: "Cogito'ya hoş geldin!",
    subTitle: "Vox Cogitationis – Düşüncenin Sesi",
    description: "Bir kategori seç ve tam ekran derin sohbet sorularını keşfet — TikTok tarzı, sayfa başına bir soru ve snap kaydırma.",
  },
  Französisch: {
    mainTitle: "Bienvenue sur Cogito !",
    subTitle: "Vox Cogitationis – La voix de la pensée",
    description: "Choisis une catégorie et découvre des questions de deep-talk en plein écran — une par page avec un défilement façon TikTok.",
  },
  Portugiesisch: {
    mainTitle: "Bem-vindo ao Cogito!",
    subTitle: "Vox Cogitationis – A Voz do Pensamento",
    description: "Escolhe uma categoria e explora perguntas de conversa profunda em ecrã inteiro — uma por página com deslocamento ao estilo TikTok.",
  },
};

/* ===== Kategorie-Beschreibung ===== */
const categoryDescriptionTemplate: Record<LanguageKey, (category: string) => string> = {
  Englisch: (c) => `Prompts and questions about “${c}” — great for deeper conversations.`,
  Deutsch: (c) => `Fragen und Impulse rund um „${c}“ – ideal für tiefere Gespräche.`,
  Spanisch: (c) => `Preguntas e ideas sobre «${c}», perfectas para conversaciones más profundas.`,
  Türkisch: (c) => `“${c}” üzerine sorular ve düşünce kıvılcımları — derin sohbetler için ideal.`,
  Französisch: (c) => `Questions et inspirations autour de « ${c} » — parfait pour des échanges plus profonds.`,
  Portugiesisch: (c) => `Perguntas e ideias sobre “${c}” — ideal para conversas mais profundas.`,
};

/* ===== Icon- & Kategorienormalisierung ===== */
const IconSize = 36;

function normalizeCategoryName(name: string): string {
  let s = (name || "").toString();
  s = s.replace(/İ/g, "I").replace(/ı/g, "i"); // türkisch
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.toLowerCase().trim();
  s = s.replace(/&/g, " and ");
  s = s.replace(/\b(und|ve|y|et|e)\b/g, " and ");
  s = s.replace(/[^a-z\s]/g, " ");
  s = s
    .replace(/\brelations\b/g, "relation")
    .replace(/\brelationships\b/g, "relationship")
    .replace(/\bbeziehungen\b/g, "beziehung")
    .replace(/\brelaciones\b/g, "relacion")
    .replace(/\brelacionamentos\b/g, "relacionamento")
    .replace(/\biliskiler\b/g, "iliski");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/* Kategorie-Sets für feste Reihenfolge + Icons */
const FRIENDSHIP_SET = new Set(["friendship", "freundschaft", "amistad", "arkadaslik", "amitie", "amizade"].map(normalizeCategoryName));
const LOVE_SET = new Set(["love and relationship", "liebe und beziehung", "amor y relaciones", "ask ve iliskiler", "amour and relations", "amor e relacionamentos"].map(normalizeCategoryName));
const IDENTITY_SET = new Set(["identität und leben", "identidad y vida", "kimlik ve yasam", "identite and vie", "identidade e vida"].map(normalizeCategoryName));
const GOALS_SET = new Set(["goals and society", "ziele und gesellschaft", "ziele ud gesellschaft", "metas y sociedad", "hedefler ve toplum", "objectifs and societe", "metas e sociedade"].map(normalizeCategoryName));

type CategoryKey = "friendship" | "love" | "identity" | "goals" | "other";
const CATEGORY_ORDER_KEYS: CategoryKey[] = ["friendship", "love", "identity", "goals"];

function getCategoryKey(cat: string): CategoryKey {
  const n = normalizeCategoryName(cat);
  if (FRIENDSHIP_SET.has(n)) return "friendship";
  if (LOVE_SET.has(n)) return "love";
  if (IDENTITY_SET.has(n)) return "identity";
  if (GOALS_SET.has(n)) return "goals";
  return "other";
}

function getCategoryIcon(cat: string) {
  const key = getCategoryKey(cat);
  switch (key) {
    case "friendship": return <Handshake size={IconSize} strokeWidth={2} className="icon icon--emerald" />;
    case "love":       return <Heart     size={IconSize} strokeWidth={2} className="icon icon--rose" />;
    case "identity":   return <UserCircle size={IconSize} strokeWidth={2} className="icon icon--violet" />;
    case "goals":
    default:           return <Target    size={IconSize} strokeWidth={2} className="icon icon--amber" />;
  }
}

const cardBgClasses = ["card--emerald", "card--violet", "card--rose", "card--amber"] as const;

/* Kategorien sortieren (feste Reihenfolge in jeder Sprache) */
function getCategories(lang: LanguageKey): string[] {
  const data = questionsByLanguage[lang] ?? {};
  const cats = Object.keys(data);
  const withMeta = cats.map((name, i) => ({ name, key: getCategoryKey(name), i }));
  const priority = new Map<CategoryKey, number>(CATEGORY_ORDER_KEYS.map((k, idx) => [k, idx]));
  return withMeta
    .sort((a, b) => {
      const pa = priority.get(a.key) ?? Number.MAX_SAFE_INTEGER;
      const pb = priority.get(b.key) ?? Number.MAX_SAFE_INTEGER;
      if (pa !== pb) return pa - pb;
      return a.i - b.i;
    })
    .map((x) => x.name);
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildQuestionDeck(lang: LanguageKey, category: string): string[] {
  const data = questionsByLanguage[lang] ?? {};
  const list = Array.isArray((data as any)[category]) ? ((data as any)[category] as string[]) : [];
  return shuffle(list);
}

/* ===== Component ===== */
export default function DeepTalkApp() {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageKey>("Englisch"); // Landing in Englisch
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [deck, setDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const observer = useRef<IntersectionObserver | null>(null);
  const categoriesRef = useRef<HTMLDivElement | null>(null);

  /* Hintergrund-Styles pro Theme */
  const backgroundStyle =
    theme === "light"
      ? "linear-gradient(-45deg, #f3e3d5c4, #f5e4d2ff, #d8d9f6ff, #f3d6da)" // etwas dunkler/neutraler als zuvor
      : "linear-gradient(-45deg, #0f1012, #0a0b0d, #000000, #121316)";

  const textColor = theme === "dark" ? "#fff" : "#111";

  useEffect(() => {
    if (selectedCategory) {
      const newDeck = buildQuestionDeck(selectedLanguage, selectedCategory);
      setDeck(newDeck);
      const safeIndex = newDeck.length === 0 ? 0 : Math.min(currentIndex, newDeck.length - 1);
      setCurrentIndex(safeIndex);
      setTimeout(() => {
        document.getElementById(`q-${safeIndex}`)?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }, [selectedLanguage]);

  const selectCategory = useCallback((cat: string) => {
    setSelectedCategory(cat);
    const d = buildQuestionDeck(selectedLanguage, cat);
    setDeck(d);
    setCurrentIndex(0);
    setTimeout(() => {
      document.getElementById("q-0")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }, [selectedLanguage]);

  const goBackToMenu = useCallback(() => {
    setSelectedCategory(null);
    setDeck([]);
    setCurrentIndex(0);
    categoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const showNext = useCallback(() => {
    if (deck.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % deck.length);
  }, [deck.length]);

  const lastQuestionRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) showNext();
    }, { threshold: 0.8 });
    if (node) observer.current.observe(node);
  }, [showNext]);

  const categories = useMemo(() => getCategories(selectedLanguage), [selectedLanguage]);
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
      {/* Animation-Keyframes */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Dark-Mode Vignette, nur im Dark Theme */}
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

      {/* Toolbar oben rechts */}
      <div style={{ position: "fixed", top: 10, right: 10, zIndex: 10, display: "flex", gap: 10, alignItems: "center" }}>
        <FlagDropdownButton language={selectedLanguage} setLanguage={setSelectedLanguage} languageConfig={languageConfig} />
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
          <span style={{ fontSize: 12, fontWeight: 600 }}>{theme === "light" ? "Dark" : "Light"}</span>
        </button>
      </div>

      {/* Zurück ins Menü */}
      {selectedCategory && (
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

      {/* Landing Page */}
      <section className="shell shell--center" style={{ height: "100vh", scrollSnapAlign: "start", position: "relative", zIndex: 1 }}>
        <div>
          <h1 className="hero__title">{texts.mainTitle}</h1>
          <p style={{ margin: "8px 0", fontStyle: "italic", fontSize: "1.2rem" }}>{texts.subTitle}</p>
          <p style={{ fontSize: "0.9rem", maxWidth: "600px", margin: "0 auto" }}>{texts.description}</p>
        </div>
      </section>

      {/* Kategorien (feste Reihenfolge) */}
      {selectedCategory === null ? (
        <section
          ref={categoriesRef}
          className="shell"
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <main className="grid" style={{ width: "100%" }}>
            <div className="grid__inner">
              {categories.map((cat, idx) => {
                const Icon = getCategoryIcon(cat);
                return (
                  <button
                    key={cat}
                    className={`card ${cardBgClasses[idx % cardBgClasses.length]}`}
                    onClick={() => selectCategory(cat)}
                    style={{ textAlign: "left", cursor: "pointer", width: "100%" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: `${IconSize + 6}px` }}>
                        {Icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h2 className="card__title" style={{ margin: 0 }}>{cat}</h2>
                        <p className="card__text">{categoryDescriptionTemplate[selectedLanguage](cat)}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </main>
        </section>
      ) : (
        /* Fragen-Viewer */
        <>
          {Array.from({ length: currentIndex + 1 }).map((_, i) => {
            const catIndex = Math.max(0, categories.indexOf(selectedCategory!));
            const Icon = getCategoryIcon(selectedCategory!);
            const question = deck.length === 0 ? "" : deck[i % deck.length];
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
                  boxSizing: "border-box",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <div className={`card ${cardBgClasses[catIndex % cardBgClasses.length]}`} style={{ width: "min(900px, 94%)", margin: "0 auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minWidth: `${IconSize + 6}px` }}>
                      {Icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h2 className="card__title" style={{ margin: 0 }}>{selectedCategory}</h2>
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
