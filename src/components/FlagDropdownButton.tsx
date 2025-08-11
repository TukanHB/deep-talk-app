"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export type LanguageItem = {
  key: string;    // z.B. "Englisch"
  label: string;  // z.B. "English"
  flag: string;   // z.B. "🇬🇧"
  button: string; // z.B. "Shuffle"
};

type Props = {
  language: string;
  setLanguage: (key: string) => void;
  languageConfig: readonly LanguageItem[] | LanguageItem[];
};

export default function FlagDropdownButton({
  language,
  setLanguage,
  languageConfig,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const current =
    languageConfig.find((l) => l.key === language) ?? languageConfig[0];

  // Outside-click → schließen
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      {/* Button */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="group flex items-center justify-center gap-2 rounded-full px-3 py-2 bg-white/85 backdrop-blur border border-gray-300 shadow hover:shadow-lg hover:bg-white transition"
      >
        <span className="text-xl" aria-hidden="true">{current.flag}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition" />
        <span className="sr-only">{current.label}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-44 rounded-xl border border-gray-200 bg-white/95 backdrop-blur shadow-lg z-50"
        >
          <ul className="py-1">
            {languageConfig.map((opt) => (
              <li
                key={opt.key}
                role="option"
                aria-selected={opt.key === language}
                onClick={() => {
                  setLanguage(opt.key);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                  opt.key === language ? "bg-gray-50 font-medium" : ""
                }`}
              >
                <span className="text-xl" aria-hidden="true">{opt.flag}</span>
                <span className="text-sm">{opt.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
