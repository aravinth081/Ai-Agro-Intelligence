import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/agro/TranslationProvider";
import { useDatasets } from "@/components/agro/useDatasets";
import { getProfile } from "@/components/agro/storage";
import { computeAlerts, computeCropOptions, computeIntegratedRisk } from "@/components/agro/riskEngine";
import { RiskBars } from "@/components/agro/RiskBars";
import { formatINR } from "@/components/agro/format";

export default function Simulator() {
  const { t, lang } = useT();
  const { weather, disease, market, loading } = useDatasets();
  const profile = getProfile();
  const [strategyMode, setStrategyMode] = useState("min_wc");

  const [rainfallDecreasePct, setRainfallDecreasePct] = useState(10);
  const [tempIncreaseC, setTempIncreaseC] = useState(1);
  const [diseasePressureIncreasePct, setDiseasePressureIncreasePct] = useState(10);
  const [priceDropPct, setPriceDropPct] = useState(8);

  const whatIf = { rainfallDecreasePct, tempIncreaseC, diseasePressureIncreasePct, priceDropPct };

  const r = useMemo(() => {
    if (!weather || !disease || !market) return null;
    return computeIntegratedRisk({ profile, weather, disease, market, whatIf });
  }, [profile, weather, disease, market, rainfallDecreasePct, tempIncreaseC, diseasePressureIncreasePct, priceDropPct]);

  const options = useMemo(() => {
    if (!r) return [];
    return computeCropOptions({ profile, integratedRisk: r, strategyMode });
  }, [profile, r, strategyMode]);

  const alerts = useMemo(() => {
    if (!r) return [];
    return computeAlerts({ integratedRisk: r, whatIf });
  }, [r, rainfallDecreasePct, tempIncreaseC, diseasePressureIncreasePct, priceDropPct]);

  if (loading || !r) return <div data-testid="sim-loading" className="text-sm text-muted-foreground">{t("ui.loading")}</div>;

  return (
    <div data-testid="simulator-page" className="space-y-6">
      <Card className="rounded-3xl border bg-white/75 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className={`font-[Outfit] text-2xl ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("sim.title")}</CardTitle>
          <div data-testid="sim-subtitle" className={`text-sm text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("sim.subtitle")}</div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge data-testid="sim-district" className="bg-white border">{r.district}</Badge>
            <Badge data-testid="sim-confidence" className="bg-[#F1F8E9] text-[#1B5E20] border border-[#1B5E20]/15">{t("common.confidence")}: {r.confidence}%</Badge>
          </div>

          <div className="rounded-2xl border bg-white/70 p-4 space-y-4">
            <div className="flex flex-wrap gap-2 items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{t("dashboard.strategy.title")}</div>
                <div className={`text-xs text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.switching_changes_note")}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button data-testid="sim-strategy-minwc" variant={strategyMode === "min_wc" ? "default" : "outline"} className={strategyMode === "min_wc" ? "rounded-full bg-[#1B5E20] hover:bg-[#1B5E20]/90" : "rounded-full"} onClick={() => setStrategyMode("min_wc")}>
                  {t("dashboard.strategy.min_wc")}
                </Button>
                <Button data-testid="sim-strategy-maxer" variant={strategyMode === "max_er" ? "default" : "outline"} className={strategyMode === "max_er" ? "rounded-full bg-[#1B5E20] hover:bg-[#1B5E20]/90" : "rounded-full"} onClick={() => setStrategyMode("max_er")}>
                  {t("dashboard.strategy.max_er")}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div data-testid="sim-rainfall-label" className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("sim.rainfall_decrease")}: <span data-testid="sim-rainfall-value" className="font-semibold">{rainfallDecreasePct}%</span></div>
                <Slider data-testid="sim-rainfall-slider" value={[rainfallDecreasePct]} onValueChange={(v) => setRainfallDecreasePct(v[0])} min={0} max={40} step={1} />
              </div>
              <div className="space-y-2">
                <div data-testid="sim-temp-label" className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("sim.temp_increase")}: <span data-testid="sim-temp-value" className="font-semibold">{tempIncreaseC}°C</span></div>
                <Slider data-testid="sim-temp-slider" value={[tempIncreaseC]} onValueChange={(v) => setTempIncreaseC(v[0])} min={0} max={6} step={0.5} />
              </div>
              <div className="space-y-2">
                <div data-testid="sim-disease-label" className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("sim.disease_pressure")}: <span data-testid="sim-disease-value" className="font-semibold">{diseasePressureIncreasePct}%</span></div>
                <Slider data-testid="sim-disease-slider" value={[diseasePressureIncreasePct]} onValueChange={(v) => setDiseasePressureIncreasePct(v[0])} min={0} max={50} step={1} />
              </div>
              <div className="space-y-2">
                <div data-testid="sim-price-label" className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("sim.price_drop")}: <span data-testid="sim-price-value" className="font-semibold">{priceDropPct}%</span></div>
                <Slider data-testid="sim-price-slider" value={[priceDropPct]} onValueChange={(v) => setPriceDropPct(v[0])} min={0} max={40} step={1} />
              </div>
            </div>
          </div>

          <Card className="rounded-2xl border bg-white/70">
            <CardHeader className="pb-3"><CardTitle className={`text-base ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.updated_integrated_risk")}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <RiskBars testIdPrefix="sim-integrated" label={t("risk.integrated.title")} value01={r.integrated.score01} level={r.integrated.level} confidence={r.confidence} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-xl border bg-[#F1F8E9] p-3">
                  <div className="text-xs font-semibold">{t("common.worst_case")}</div>
                  <div data-testid="sim-worst-case" className="text-xs text-muted-foreground mt-1">
                    Yield loss {r.worstCase.yieldLossPct}% • Price drop {r.worstCase.priceDropPct}% • Repayment stress {r.worstCase.repaymentStressPct}%
                  </div>
                </div>
                <div className="rounded-xl border bg-white p-3">
                  <div className={`text-xs font-semibold ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.explanation")}</div>
                  <div data-testid="sim-explain" className={`text-xs text-muted-foreground mt-1 ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.sim_explain")}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-white/70">
            <CardHeader className="pb-3"><CardTitle className={`text-base ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.tradeoff_options")}</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.slice(0, 3).map((opt) => (
                  <div data-testid={`sim-option-${opt.cropKey}`} key={opt.cropKey} className="rounded-2xl border bg-white/80 p-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold">{t(opt.cropKey)}</div>
                      <span className={`ag-risk-pill ${opt.risk.level === "low" ? "ag-risk-low" : opt.risk.level === "high" ? "ag-risk-high" : "ag-risk-med"}`}>
                        {opt.risk.level}
                      </span>
                    </div>
                    <div data-testid={`sim-option-${opt.cropKey}-yield`} className={`text-sm text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.sim_option_yield")}: {opt.yieldRange.min}–{opt.yieldRange.max} {opt.yieldRange.unit}</div>
                    <div data-testid={`sim-option-${opt.cropKey}-profit`} className={`text-sm text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.sim_option_profit")}: {formatINR(opt.profitRange.min)}–{formatINR(opt.profitRange.max)}</div>
                    <div data-testid={`sim-option-${opt.cropKey}-confidence`} className="text-xs text-muted-foreground">{t("common.confidence")}: {opt.confidence}%</div>
                    <div className="rounded-xl border bg-[#F1F8E9] p-3">
                      <div className="text-xs font-semibold">{t("common.worst_case")}</div>
                      <div data-testid={`sim-option-${opt.cropKey}-wc`} className="text-xs text-muted-foreground mt-1">Worst‑case loss estimate: {formatINR(opt.worstCaseLoss)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border bg-white/70">
            <CardHeader className="pb-3"><CardTitle className="text-base">{t("alerts.title")}</CardTitle></CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div data-testid="alerts-none" className="text-sm text-muted-foreground">{t("alerts.none")}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {alerts.map((a, idx) => (
                    <div data-testid={`alert-${a.type}-${idx}`} key={`${a.type}-${idx}`} className="rounded-2xl border bg-white/80 p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <div data-testid={`alert-${a.type}-title`} className="font-semibold">
                          {a.type === "rainfall" ? t("alerts.rainfall") : a.type === "pest" ? t("alerts.pest") : a.type === "market" ? t("alerts.market") : t("alerts.loan")}
                        </div>
                        <Badge data-testid={`alert-${a.type}-confidence`} className="bg-white border">{t("common.confidence")}: {a.confidence}%</Badge>
                      </div>
                      <div data-testid={`alert-${a.type}-trigger`} className="text-xs text-muted-foreground">Trigger: {a.trigger}</div>
                      <div className="rounded-xl border bg-[#F1F8E9] p-3">
                        <div className="text-xs font-semibold">{t("alerts.reco")}</div>
                        <div data-testid={`alert-${a.type}-caution`} className="text-xs text-muted-foreground mt-1">{a.caution}</div>
                        <div className="mt-2 text-xs font-semibold">{t("alerts.wc")}</div>
                        <div data-testid={`alert-${a.type}-wc`} className="text-xs text-muted-foreground mt-1">{a.worstCase}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button data-testid="sim-reset-button" variant="outline" className="rounded-2xl" onClick={() => {
              setRainfallDecreasePct(10);
              setTempIncreaseC(1);
              setDiseasePressureIncreasePct(10);
              setPriceDropPct(8);
            }}>
              {t("common.reset")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
