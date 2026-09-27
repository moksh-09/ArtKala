"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import enLocale from "@/locales/en.json";
import hiLocale from "@/locales/hi.json";

export type Language = "en" | "hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isTransitioning: boolean;
  t: (keyPath: string, fallback?: string) => string;
}

const dictionaries: Record<Language, Record<string, unknown>> = {
  en: enLocale as Record<string, unknown>,
  hi: hiLocale as Record<string, unknown>,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("artkala_language") as Language | null;
      if (savedLang === "en" || savedLang === "hi") {
        setLanguageState(savedLang);
      }
    } catch {
      // LocalStorage access may fail in private mode or SSR
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    if (newLang === language) return;
    setIsTransitioning(true);
    
    // Smooth sequence: fade out & slight blur (150ms), swap language, fade in (150ms)
    setTimeout(() => {
      setLanguageState(newLang);
      try {
        localStorage.setItem("artkala_language", newLang);
      } catch {}
      setTimeout(() => {
        setIsTransitioning(false);
      }, 180);
    }, 160);
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "hi" : "en");
  }, [language, setLanguage]);

  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const dict = dictionaries[language];
      const parts = keyPath.split(".");
      let current: unknown = dict;

      for (const part of parts) {
        if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
          current = (current as Record<string, unknown>)[part];
        } else {
          current = undefined;
          break;
        }
      }

      if (typeof current === "string") {
        return current;
      }

      // Fallback to English dictionary if not found in current dictionary
      if (language !== "en") {
        let enCurrent: unknown = dictionaries.en;
        for (const part of parts) {
          if (enCurrent && typeof enCurrent === "object" && part in (enCurrent as Record<string, unknown>)) {
            enCurrent = (enCurrent as Record<string, unknown>)[part];
          } else {
            enCurrent = undefined;
            break;
          }
        }
        if (typeof enCurrent === "string") return enCurrent;
      }

      return fallback ?? keyPath;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        isTransitioning,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

/**
 * VanishText: Reusable designed language vanish transition component.
 * Sequence:
 * 1. Existing text gradually loses opacity.
 * 2. Subtle blur / displacement (0.5px blur, 2px y displacement).
 * 3. Text vanishes and new language smoothly appears.
 * 4. Returns to full opacity and crisp rendering.
 * Total target duration ~320ms.
 * Honors prefers-reduced-motion.
 */
interface VanishTextProps {
  textKey: string;
  fallback?: string;
  className?: string;
  as?: React.ElementType;
}

export function VanishText({
  textKey,
  fallback,
  className = "",
  as: Component = "span",
}: VanishTextProps) {
  const { language, t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();
  const text = t(textKey, fallback);

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={`${textKey}-${language}`}
        initial={{ opacity: 0, filter: "blur(4px)", y: 2 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(3px)", y: -2 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className={`inline-block ${className}`}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}
