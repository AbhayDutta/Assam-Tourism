"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setMounted(true);
  });

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "hi", name: "हिंदी", flag: "🇮🇳" },
    { code: "as", name: "অসমীয়া", flag: "🇮🇳" },
    { code: "ta", name: "தமிழ்", flag: "🇮🇳" },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageSelect = (langCode: "en" | "hi" | "as" | "ta") => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  if (!mounted) {
    return (
      <div className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2">
        <div className="h-5 w-5 animate-pulse rounded bg-[var(--muted)]" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--foreground)] transition-all duration-200 hover:bg-[var(--surface-elevated)] hover:border-[var(--muted)]"
        aria-label="Change language"
        title={`Current: ${currentLanguage?.name}. Click to select language.`}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code as "en" | "hi" | "as" | "ta")}
              className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                language === lang.code
                  ? "bg-[var(--accent-warm)] text-white"
                  : "text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <svg
                  className="ml-auto h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
