import { useEffect, useState } from "react";

export const useDatasets = () => {
  const [data, setData] = useState({
    farmerProfiles: null,
    weather: null,
    disease: null,
    market: null,
    products: null,
    loanData: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [farmerProfiles, weather, disease, market, products, loanData] = await Promise.all([
          fetch("/data/farmerProfiles.json", { cache: "no-store" }).then((r) => r.json()),
          fetch("/data/weather.json", { cache: "no-store" }).then((r) => r.json()),
          fetch("/data/disease.json", { cache: "no-store" }).then((r) => r.json()),
          fetch("/data/market.json", { cache: "no-store" }).then((r) => r.json()),
          fetch("/data/products.json", { cache: "no-store" }).then((r) => r.json()),
          fetch("/data/loanData.json", { cache: "no-store" }).then((r) => r.json()),
        ]);
        if (!mounted) return;
        setData({ farmerProfiles, weather, disease, market, products, loanData, loading: false });
      } catch (e) {
        console.error("Failed to load datasets", e);
        if (!mounted) return;
        setData((s) => ({ ...s, loading: false }));
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return data;
};
