"use client";

import React from "react";

export type LanguageKey =
  | "Englisch"
  | "Deutsch"
  | "Spanisch"
  | "Türkisch"
  | "Französisch"
  | "Portugiesisch";

export type LanguageItem = {
  key: LanguageKey;
  label: string;
  flag: string;
  button: string;
};

type Props = {
  language: LanguageKey;
  setLanguage: (l: LanguageKey) => void;
  languageConfig: readonly LanguageItem[];
};

export default function FlagDropdownButton({
  language,
  setLanguage,
  languageConfig,
}: Props) {
  return (
    <label className="ui-select">
      <span className="ui-select__flag" aria-hidden>
        {languageConfig.find((o) => o.key === language)?.flag ?? "🏳️"}
      </span>
      <select
        aria-label="Language selector"
        className="ui-select__native"
        value={language}
        onChange={(e) => setLanguage(e.target.value as LanguageKey)}
      >
        {languageConfig.map((opt) => (
          <option key={opt.key} value={opt.key}>
            {opt.flag} {opt.label}
          </option>
        ))}
      </select>
      <span className="ui-select__chevron" aria-hidden>▾</span>
    </label>
  );
}
