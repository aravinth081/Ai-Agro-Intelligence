import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDatasets } from "@/components/agro/useDatasets";
import { getProfile } from "@/components/agro/storage";
import { computeIntegratedRisk } from "@/components/agro/riskEngine";
import { useT } from "@/components/agro/TranslationProvider";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const actions = [
  { id: "sell", key: "intel.action.sell" },
  { id: "hold", key: "intel.action.hold" },
  { id: "partial", key: "intel.action.partial" },
];

export default function Market() {
  const { t, lang } = useT();
  const { weather, disease, market, loading } = useDatasets();
  const profile = getProfile();
  const [cropKey, setCropKey] = useState("crop.paddy");
  const [action, setAction] = useState("hold");

  const r = useMemo(() => {
    if (!weather || !disease || !market) return null;
    return computeIntegratedRisk({ profile, weather, disease, market, whatIf: null });
  }, [profile, weather, disease, market]);

  const history = useMemo(() => {
    if (!r || !market) return [];
    const d = market.districts?.[r.district];
    const arr = d?.price_history?.[cropKey] || [];
    return arr.map((v, i) => ({ m: i + 1, price: v }));
  }, [r, market, cropKey]);

  if (loading || !r) return <div data-testid="market-loading" className="text-sm text-muted-foreground">{t("ui.loading")}</div>;

  const volBand = market.defaults?.volatility_band_pct;
  const down =
    action === "sell"
      ? t("ui.market_action_down_sell")
      : action === "partial"
        ? t("ui.market_action_down_partial")
        : t("ui.market_action_down_hold");

  return (
    <div data-testid="market-page" className="space-y-6">
      <Card className="rounded-3xl border bg-white/75 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className={`font-[Outfit] text-2xl ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("intel.title")}</CardTitle>
          <div data-testid="market-subtitle" className={`text-sm text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("intel.subtitle")}</div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <Badge data-testid="market-district" className="bg-white border">{r.district}</Badge>
            <Badge data-testid="market-volatility" className="bg-[#F1F8E9] text-[#1B5E20] border border-[#1B5E20]/15">
              {t("risk.market.volatility")}: {r.marketVolatilityIndex.min}–{r.marketVolatilityIndex.max} ({t("common.confidence")}: {r.marketVolatilityIndex.confidence}%)
            </Badge>
            <Badge data-testid="market-vol-band" className="bg-white border">{t("ui.vol_band")}: {volBand?.min}–{volBand?.max}%</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.crop")}</div>
              <Select value={cropKey} onValueChange={setCropKey}>
                <SelectTrigger data-testid="market-crop-select" className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem data-testid="market-crop-paddy" value="crop.paddy">{t("crop.paddy")}</SelectItem>
                  <SelectItem data-testid="market-crop-groundnut" value="crop.groundnut">{t("crop.groundnut")}</SelectItem>
                  <SelectItem data-testid="market-crop-millet" value="crop.millet">{t("crop.millet")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.action")}</div>
              <div className="flex flex-wrap gap-2">
                {actions.map((a) => (
                  <Button
                    data-testid={`market-action-${a.id}-button`}
                    key={a.id}
                    variant={action === a.id ? "default" : "outline"}
                    className={action === a.id ? "rounded-full bg-[#1B5E20] hover:bg-[#1B5E20]/90" : "rounded-full"}
                    onClick={() => setAction(a.id)}
                  >
                    {t(a.key)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border bg-white/70 p-4">
              <div data-testid="market-context" className={`text-sm text-muted-foreground leading-relaxed ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>
                {t("ui.market_context")}: rainfall {r.rainfallMm.min}–{r.rainfallMm.max}mm, disease {r.diseasePressurePct.min}–{r.diseasePressurePct.max}%.
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white/70 p-4">
            <div data-testid="market-chart-title" className={`text-sm font-semibold mb-3 ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.mock_price_title")}</div>
            <div data-testid="market-price-chart" className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ left: 8, right: 16, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />
                  <XAxis dataKey="m" tickFormatter={(v) => `M${v}`} />
                  <YAxis width={60} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#1B5E20" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border bg-[#F1F8E9] p-4">
            <div data-testid="market-action-downside-title" className="text-xs font-semibold">{t("intel.action.downside")}</div>
            <div data-testid="market-action-downside" className="text-sm text-muted-foreground mt-1">{down}</div>
            <div data-testid="market-action-confidence" className="text-xs text-[#1B5E20] mt-2">{t("common.confidence")}: {Math.max(35, r.confidence - (action === "hold" ? 6 : 2))}%</div>
          </div>

          <div className="text-xs text-muted-foreground">{t("market.note")}</div>
        </CardContent>
      </Card>
    </div>
  );
}
