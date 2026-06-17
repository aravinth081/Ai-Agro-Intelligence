export const formatINR = (n) => {
  const v = Number(n);
  if (Number.isNaN(v)) return "₹0";
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v).replace(/^/, "₹");
};

export const formatRange = (min, max, fmt = (x) => x) => {
  return `${fmt(min)}–${fmt(max)}`;
};

export const pctRange = (min, max) => `${min}–${max}%`;
