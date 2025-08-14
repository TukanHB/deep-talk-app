"use client";

import React, { useEffect, useRef, useState } from "react";

/** ====== Öffentliche Typen (werden von DeepTalkApp importiert) ====== */
export type LanguageKey =
  | "Englisch"
  | "Deutsch"
  | "Spanisch"
  | "Türkisch"
  | "Französisch"
  | "Portugiesisch";

export interface LanguageItem {
  key: LanguageKey;
  label: string; // Anzeigename, z. B. "English"
  flag: string; // Emoji, z. B. "🇬🇧" – wird versucht, aber es gibt Fallback
  button?: string; // optional – ungenutzt, nur für alte Typen
}

/** ====== Interne Helpers ====== */
const EMOJI_FONT_STACK =
  '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","EmojiOne Color",sans-serif';

// Fallback-Badge-Farben pro Sprache (dezent, gut sichtbar)
const FALLBACK_COLORS: Record<LanguageKey, { bg: string; fg: string; code: string }> = {
  Englisch: { bg: "#1e3a8a", fg: "#ffffff", code: "EN" },
  Deutsch: { bg: "#111827", fg: "#fbbf24", code: "DE" },
  Spanisch: { bg: "#b91c1c", fg: "#fde68a", code: "ES" },
  Türkisch: { bg: "#991b1b", fg: "#ffffff", code: "TR" },
  Französische: { bg: "#1f2937", fg: "#93c5fd", code: "FR" }, // nur falls jemand "Französische" schreibt
  Französich: { bg: "#1f2937", fg: "#93c5fd", code: "FR" }, // Schreibfehler-Schutz
  FranzösischeR: { bg: "#1f2937", fg: "#93c5fd", code: "FR" }, // weiterer Schutz
  // KORREKTER Schlüssel unten:
  FranzösichX: { bg: "#1f2937", fg: "#93c5fd", code: "FR" },
  // -> wir definieren die korrekte Zeile gleich:
} as any;

// Korrekte Keys separat ergänzen (damit TS zufrieden ist)
(FALLBACK_COLORS as any)["Französisch"] = { bg: "#1f2937", fg: "#93c5fd", code: "FR" };
(FALLBACK_COLORS as any)["Portugiesisch"] = { bg: "#065f46", fg: "#d1fae5", code: "PT" };

// prüft, ob das Emoji tatsächlich **sichtbar** gerendert wird
function useEmojiVisibility(emoji: string) {
  const [visible, setVisible] = useState(true);
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!spanRef.current) return;
    const el = spanRef.current;
    // Heuristik: Wenn das Element praktisch keine Breite bekommt, wird das Emoji nicht angezeigt
    const width = el.getBoundingClientRect().width;
    // 10px als Schwellwert: Emoji sollte >10px breit sein
    setVisible(width > 10);
  }, [emoji]);

  return { visible, spanRef };
}

function FlagGlyph({ emoji, labelCode }: { emoji: string; labelCode: string }) {
  const { visible, spanRef } = useEmojiVisibility(emoji);

  return (
    <div style={{ position: "relative", width: 24, height: 18 }}>
      {/* Emoji-Versuch */}
      <span
        ref={spanRef}
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 24,
          height: 18,
          lineHeight: "18px",
          fontSize: 18,
          fontFamily: EMOJI_FONT_STACK,
          // wichtig: Emojis nicht vom Theme einfärben
          color: "unset",
          display: "inline-block",
          textAlign: "center",
          opacity: visible ? 1 : 0, // wenn unsichtbar, überblenden
          transition: "opacity 0.2s",
        }}
      >
        {emoji}
      </span>

      {/* Fallback-Badge (nur sichtbar, wenn Emoji unsichtbar) */}
      {!visible && (
        <div
          aria-hidden
          style={{
            width: 24,
            height: 18,
            borderRadius: 4,
            background: "#111827",
            color: "#fff",
            fontSize: 10,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: 0.5,
          }}
        >
          {labelCode}
        </div>
      )}
    </div>
  );
}

/** ====== Komponent-Props ====== */
interface FlagDropdownButtonProps {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  languageConfig: readonly LanguageItem[];
}

/** ====== Component ====== */
export default function FlagDropdownButton({
  language,
  setLanguage,
  languageConfig,
}: FlagDropdownButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const current = languageConfig.find((l) => l.key === language);

  // Klick außerhalb schließt Dropdown
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const fallback = FALLBACK_COLORS[language] ?? { bg: "#111827", fg: "#fff", code: "??" };

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        zIndex: 200, // hoch genug, damit nichts drüber liegt
        fontFamily: EMOJI_FONT_STACK,
      }}
    >
      {/* Aktueller Button */}
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          cursor: "pointer",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 10,
          padding: "6px 10px",
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          color: "#111",
          backdropFilter: "saturate(120%) blur(4px)",
        }}
      >
        <FlagGlyph emoji={current?.flag ?? ""} labelCode={fallback.code} />
        <span style={{ fontSize: 14, fontWeight: 600 }}>{current?.label ?? "Language"}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          style={{ marginLeft: 2, opacity: 0.7 }}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Dropdown-Liste */}
      {open && (
        <div
          role="listbox"
          aria-label="Select language"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 200,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 10,
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            overflow: "hidden",
            zIndex: 250,
          }}
        >
          {languageConfig.map((lang) => {
            const colors = (FALLBACK_COLORS as any)[lang.key] ?? {
              bg: "#111827",
              fg: "#fff",
              code: "??",
            };
            const isActive = lang.key === language;
            return (
              <button
                key={lang.key}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setLanguage(lang.key);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: "8px 12px",
                  background: isActive ? "rgba(0,0,0,0.05)" : "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "#111",
                }}
              >
                <FlagGlyph emoji={lang.flag} labelCode={colors.code} />
                <span style={{ fontSize: 14 }}>{lang.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
