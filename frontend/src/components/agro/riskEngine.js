import { getFeedback } from "@/components/agro/storage";

const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
const round = (n) => Math.round(n);

export const riskLevelFromScore = (score01) => {
  if (score01 < 0.33) return "low";
  if (score01 < 0.66) return "moderate";
  return "high";
};

export const riskColorClass = (level) => {
  if (level === "low") return "ag-risk-low";
  if (level === "high") return "ag-risk-high";
  return "ag-risk-med";
};

export const computeIntegratedRisk = ({ profile, weather, disease, market, whatIf }) => {
  const district = profile?.location || weather?.defaults?.district;
  const w = weather?.districts?.[district] || Object.values(weather?.districts || {})[0];
  const d = disease?.districts?.[district] || Object.values(disease?.districts || {})[0];
  const m = market?.districts?.[district] || Object.values(market?.districts || {})[0];

  const rainfall = { ...w.rainfall_mm };
  const temp = { ...w.temp_stress_c };
  const dis = { ...d.pressure_pct };
  const vol = { ...m.volatility_index };

  const wf = {
    rainfallDecreasePct: whatIf?.rainfallDecreasePct ?? 0,
    tempIncreaseC: whatIf?.tempIncreaseC ?? 0,
    diseasePressureIncreasePct: whatIf?.diseasePressureIncreasePct ?? 0,
    priceDropPct: whatIf?.priceDropPct ?? 0,
  };

  // Apply what-if as widening bands (more uncertainty) + shift worst case.
  const rainPenalty = wf.rainfallDecreasePct / 100;
  const tempPenalty = wf.tempIncreaseC / 6;
  const diseasePenalty = wf.diseasePressureIncreasePct / 100;
  const pricePenalty = wf.priceDropPct / 100;

  const rainfallAdj = {
    min: round(rainfall.min * (1 - 0.7 * rainPenalty)),
    max: round(rainfall.max * (1 - 0.15 * rainPenalty)),
    confidence: clamp(rainfall.confidence - round(18 * rainPenalty), 35, 85),
  };

  const tempAdj = {
    min: round(temp.min + 0.5 * wf.tempIncreaseC),
    max: round(temp.max + 1.0 * wf.tempIncreaseC),
    confidence: clamp(temp.confidence - round(10 * tempPenalty), 35, 85),
  };

  const diseaseAdj = {
    min: clamp(round(dis.min + 30 * diseasePenalty), 0, 95),
    max: clamp(round(dis.max + 45 * diseasePenalty), 0, 98),
    confidence: clamp(dis.confidence - round(14 * diseasePenalty), 35, 85),
  };

  const volatilityAdj = {
    min: clamp(round(vol.min + 30 * pricePenalty), 0, 100),
    max: clamp(round(vol.max + 45 * pricePenalty), 0, 100),
    confidence: clamp(vol.confidence - round(12 * pricePenalty), 35, 85),
  };

  const land = Number(profile?.landSizeAcres || 2);
  const buffer = Number(profile?.financialBuffer || 0);
  const loans = Number(profile?.existingLoans || 0);

  const riskTol = profile?.riskTolerance || "low";
  const tolFactor = riskTol === "high" ? 0.9 : riskTol === "medium" ? 1.0 : 1.1;

  const exposure01 = clamp(
    (loans / Math.max(1, buffer + 50000)) * 0.65 + (land < 2 ? 0.18 : land < 5 ? 0.1 : 0.06),
    0,
    1
  );

  const drought01 = clamp(1 - (rainfallAdj.min / Math.max(1, rainfallAdj.max)), 0, 1);
  const heat01 = clamp((tempAdj.max - 32) / 8, 0, 1);
  const disease01 = clamp(diseaseAdj.max / 100, 0, 1);
  const market01 = clamp(volatilityAdj.max / 100, 0, 1);

  const integratedScore01 = clamp(
    (0.32 * drought01 + 0.18 * heat01 + 0.22 * disease01 + 0.18 * market01 + 0.10 * exposure01) * tolFactor,
    0,
    1
  );

  const confidenceBase = round((rainfallAdj.confidence + tempAdj.confidence + diseaseAdj.confidence + volatilityAdj.confidence) / 4);
  const feedback = getFeedback();
  const weight = clamp(Number(feedback?.confidenceWeight || 1), 0.7, 1.2);
  const confidence = clamp(round(confidenceBase * weight), 35, 90);

  const worstCase = {
    yieldLossPct: clamp(round(10 + 28 * drought01 + 18 * disease01 + 10 * heat01), 8, 65),
    priceDropPct: clamp(round(6 + 22 * market01 + 10 * pricePenalty), 5, 55),
    repaymentStressPct: clamp(round(8 + 28 * exposure01 + 18 * integratedScore01), 8, 65),
  };

  return {
    district,
    rainfallMm: rainfallAdj,
    tempStressC: tempAdj,
    diseasePressurePct: diseaseAdj,
    marketVolatilityIndex: volatilityAdj,
    financialExposure: {
      min: round(100 * clamp(exposure01 * 0.7, 0, 1)),
      max: round(100 * clamp(exposure01 * 1.05, 0, 1)),
    },
    integrated: {
      score01: integratedScore01,
      level: riskLevelFromScore(integratedScore01),
    },
    confidence,
    worstCase,
    interconnectionExplanation:
      "Rainfall and temperature shift the yield band; disease pressure compounds losses; market volatility affects sale price; lower buffer or higher liabilities amplifies repayment stress.",
  };
};

export const computeCropOptions = ({ profile, integratedRisk, strategyMode }) => {
  // Exactly 3 options: paddy, groundnut, millet.
  // Strategy mode affects ordering and range width.
  const base = [
    {
      cropKey: "crop.paddy",
      waterNeed: 0.75,
      diseaseSensitivity: 0.58,
      priceStability: 0.62,
      baseYieldMin: 18,
      baseYieldMax: 26,
      baseProfitMin: 38000,
      baseProfitMax: 82000,
    },
    {
      cropKey: "crop.groundnut",
      waterNeed: 0.5,
      diseaseSensitivity: 0.52,
      priceStability: 0.48,
      baseYieldMin: 9,
      baseYieldMax: 14,
      baseProfitMin: 42000,
      baseProfitMax: 98000,
    },
    {
      cropKey: "crop.millet",
      waterNeed: 0.35,
      diseaseSensitivity: 0.42,
      priceStability: 0.55,
      baseYieldMin: 8,
      baseYieldMax: 12,
      baseProfitMin: 32000,
      baseProfitMax: 76000,
    },
  ];

  const land = Number(profile?.landSizeAcres || 2);
  const scale = clamp(land / 2, 0.8, 2.2);

  const drought01 = clamp(1 - integratedRisk.rainfallMm.min / Math.max(1, integratedRisk.rainfallMm.max), 0, 1);
  const disease01 = clamp(integratedRisk.diseasePressurePct.max / 100, 0, 1);
  const market01 = clamp(integratedRisk.marketVolatilityIndex.max / 100, 0, 1);

  const rangeTighten = strategyMode === "min_wc" ? 0.9 : 1.05; // min_wc tighter, max_er wider.

  const options = base.map((c) => {
    const climatePenalty = drought01 * c.waterNeed + clamp((integratedRisk.tempStressC.max - 33) / 10, 0, 1) * 0.25;
    const diseasePenalty = disease01 * c.diseaseSensitivity;
    const pricePenalty = market01 * (1 - c.priceStability);

    const riskScore01 = clamp(0.45 * climatePenalty + 0.35 * diseasePenalty + 0.20 * pricePenalty, 0, 1);

    const yieldMin = clamp(round(c.baseYieldMin * scale * (1 - 0.55 * riskScore01) * rangeTighten), 2, 999);
    const yieldMax = clamp(round(c.baseYieldMax * scale * (1 - 0.25 * riskScore01) * (2 - rangeTighten)), yieldMin + 1, 999);

    const profitMin = round(c.baseProfitMin * scale * (1 - 0.8 * riskScore01) * rangeTighten);
    const profitMax = round(c.baseProfitMax * scale * (1 - 0.35 * riskScore01) * (2 - rangeTighten));

    const worstCaseLoss = round(Math.max(0, profitMin) * -0.25 - (8000 * riskScore01));

    const confidence = clamp(round(integratedRisk.confidence - 10 * riskScore01), 35, 90);

    const downside =
      riskScore01 > 0.66
        ? "If rainfall is low and disease spikes together, input costs can rise while yields fall, creating cash‑flow stress."
        : riskScore01 > 0.33
          ? "If either price drops or disease pressure rises, profits can compress; plan buffer for extra sprays or delayed selling."
          : "Downside mainly comes from market price swings; monitor volatility and avoid forced selling.";

    const why =
      c.cropKey === "crop.millet"
        ? "Lower water need reduces drought downside; suitable when rainfall uncertainty is high."
        : c.cropKey === "crop.groundnut"
          ? "Higher return potential but more price sensitivity; works if you can handle volatility with buffer/insurance."
          : "More stable demand, but higher water need makes it sensitive under low rainfall bands.";

    return {
      cropKey: c.cropKey,
      yieldRange: { min: yieldMin, max: yieldMax, unit: "qtl/acre" },
      profitRange: { min: profitMin, max: profitMax, unit: "₹/season" },
      risk: { score01: riskScore01, level: riskLevelFromScore(riskScore01) },
      confidence,
      worstCaseLoss,
      why,
      downside,
    };
  });

  // Ordering changes with strategy.
  const ordered = [...options].sort((a, b) => {
    if (strategyMode === "max_er") {
      return b.profitRange.max - a.profitRange.max; // higher upside first.
    }
    // min_wc: lower worst-case loss first (closer to 0 is better).
    return b.worstCaseLoss - a.worstCaseLoss;
  });

  return ordered;
};

export const computeAlerts = ({ integratedRisk, whatIf }) => {
  const alerts = [];
  const rainDrop = whatIf?.rainfallDecreasePct ?? 0;
  const priceDrop = whatIf?.priceDropPct ?? 0;
  const disUp = whatIf?.diseasePressureIncreasePct ?? 0;

  const drought01 = clamp(1 - integratedRisk.rainfallMm.min / Math.max(1, integratedRisk.rainfallMm.max), 0, 1);
  const disease01 = clamp(integratedRisk.diseasePressurePct.max / 100, 0, 1);
  const market01 = clamp(integratedRisk.marketVolatilityIndex.max / 100, 0, 1);
  const exposure01 = clamp(integratedRisk.financialExposure.max / 100, 0, 1);

  if (drought01 > 0.48 || rainDrop >= 20) {
    alerts.push({
      type: "rainfall",
      confidence: clamp(round(integratedRisk.rainfallMm.confidence - rainDrop * 0.3), 35, 90),
      trigger: `Low rainfall band + ${rainDrop}% simulated decrease`,
      caution: "Consider drought‑tolerant seed, staggered sowing, and reduce high‑water crops.",
      worstCase: `Yield loss could widen to ~${clamp(round(integratedRisk.worstCase.yieldLossPct + 10), 10, 75)}% if dry spell persists.`,
      level: riskLevelFromScore(clamp(drought01 + 0.15, 0, 1)),
    });
  }

  if (disease01 > 0.5 || disUp >= 20) {
    alerts.push({
      type: "pest",
      confidence: clamp(round(integratedRisk.diseasePressurePct.confidence - disUp * 0.2), 35, 90),
      trigger: `Disease pressure band elevated + ${disUp}% simulated increase`,
      caution: "Increase scouting frequency; keep preventive kit ready; avoid delayed sprays.",
      worstCase: `If outbreak spikes, losses can compound and raise input costs — plan buffer for extra sprays.`,
      level: riskLevelFromScore(clamp(disease01 + 0.12, 0, 1)),
    });
  }

  if (market01 > 0.55 || priceDrop >= 15) {
    alerts.push({
      type: "market",
      confidence: clamp(round(integratedRisk.marketVolatilityIndex.confidence - priceDrop * 0.15), 35, 90),
      trigger: `Volatility band high + ${priceDrop}% simulated price drop`,
      caution: "Avoid forced selling; consider partial sell; explore storage/warehouse receipt options.",
      worstCase: `If price drops coincide with low yield, cashflow can tighten and repayment stress rises.`,
      level: riskLevelFromScore(clamp(market01 + 0.1, 0, 1)),
    });
  }

  if (exposure01 > 0.55 || integratedRisk.worstCase.repaymentStressPct > 30) {
    alerts.push({
      type: "loan",
      confidence: clamp(round(integratedRisk.confidence - 8), 35, 90),
      trigger: `Liability-to-buffer ratio elevated; stress estimate ${integratedRisk.worstCase.repaymentStressPct}%`,
      caution: "Keep repayment buffer; avoid high input commitments; consider insurance-linked options.",
      worstCase: `Under low-yield scenario, repayment stress may increase by ~${clamp(round(integratedRisk.worstCase.repaymentStressPct + 10), 10, 75)}%.`,
      level: riskLevelFromScore(clamp(exposure01 + 0.1, 0, 1)),
    });
  }

  return alerts;
};
