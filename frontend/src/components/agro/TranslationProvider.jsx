import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDefaultLang, interpolate, setLangPref } from "@/lib/i18n";

const TranslationContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  ready: false,
});

export const TranslationProvider = ({ children }) => {
  const [lang, setLangState] = useState("en");
  const [dict, setDict] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLangState(getDefaultLang());
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/data/translations.json", { cache: "no-store" });
        const json = await res.json();
        if (!mounted) return;
        setDict(json);
        setReady(true);
      } catch (e) {
        console.error("Failed to load translations.json", e);
        if (!mounted) return;
        setDict({ en: {}, ta: {} });
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const setLang = useCallback(
    (next) => {
      const safe = next === "ta" ? "ta" : "en";
      setLangPref(safe);
      setLangState(safe);
      document.documentElement.lang = safe;
      document.documentElement.dataset.lang = safe;
    },
    [setLangState]
  );

  useEffect(() => {
    document.documentElement.dataset.lang = lang;
  }, [lang]);

  const t = useCallback(
    (key, vars) => {
      const v = dict?.[lang]?.[key] ?? dict?.en?.[key] ?? key;
      return interpolate(v, vars);
    },
    [dict, lang]
  );

  const value = useMemo(() => ({ lang, setLang, t, ready }), [lang, setLang, t, ready]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export const useT = () => useContext(TranslationContext);
