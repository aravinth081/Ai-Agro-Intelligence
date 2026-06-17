const STORAGE_KEY = "agroRisk.lang";

export const getDefaultLang = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "ta" || saved === "en") return saved;
  return "en";
};

export const setLangPref = (lang) => {
  localStorage.setItem(STORAGE_KEY, lang);
};

export const interpolate = (template, vars = {}) => {
  if (!template) return "";
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = vars[k];
    return v === undefined || v === null ? `{${k}}` : String(v);
  });
};
