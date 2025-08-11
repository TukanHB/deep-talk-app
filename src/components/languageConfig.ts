export type LanguageItem = {
  key: string;
  label: string;
  flag: string;
  button: string;
};

const languageConfig: LanguageItem[] = [
  { key: "Deutsch",       label: "Deutsch",     flag: "🇩🇪", button: "Mischen" },
  { key: "Englisch",      label: "English",     flag: "🇬🇧", button: "Schuffle" },
  { key: "Spanisch",      label: "Español",     flag: "🇪🇸", button: "Sacar una carta" },
  { key: "Türkisch",      label: "Türkçe",      flag: "🇹🇷", button: "Kart çek" },
  { key: "Französisch",   label: "Français",    flag: "🇫🇷", button: "Tirer une carte" },
  { key: "Portugiesisch", label: "Português",   flag: "🇵🇹", button: "Sacar uma carta" },
];

export default languageConfig;
