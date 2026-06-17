import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDatasets } from "@/components/agro/useDatasets";
import { getProfile } from "@/components/agro/storage";
import { computeIntegratedRisk } from "@/components/agro/riskEngine";
import { useT } from "@/components/agro/TranslationProvider";

export default function Climate() {
  const { t, lang } = useT();
  const { weather, disease, market, loading } = useDatasets();
  const profile = getProfile();

  const r = useMemo(() => {
    if (!weather || !disease || !market) return null;
    return computeIntegratedRisk({ profile, weather, disease, market, whatIf: null });
  }, [profile, weather, disease, market]);

  if (loading || !r) return <div data-testid="climate-loading" className="text-sm text-muted-foreground">{t("ui.loading")}</div>;

  return (
    <div data-testid="climate-page" className="space-y-6">
      <Card className="rounded-3xl border bg-white/75 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className={`font-[Outfit] text-2xl ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("climate.title")}</CardTitle>
          <div data-testid="climate-note" className={`text-sm text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("climate.note")}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge data-testid="climate-district" className="bg-white border">{r.district}</Badge>
            <Badge data-testid="climate-confidence" className="bg-[#F1F8E9] text-[#1B5E20] border border-[#1B5E20]/15">{t("common.confidence")}: {r.confidence}%</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-white/70 p-4">
              <div data-testid="climate-rain-title" className="text-sm font-semibold">{t("risk.climate.rainfall")}</div>
              <div data-testid="climate-rain-range" className="mt-2 text-lg font-semibold">{t("tmpl.mm", { min: r.rainfallMm.min, max: r.rainfallMm.max })}</div>
              <div data-testid="climate-rain-confidence" className="text-xs text-muted-foreground mt-1">{t("common.confidence")}: {r.rainfallMm.confidence}%</div>
              <div className="mt-3 rounded-xl border bg-[#F1F8E9] p-3">
                <div className="text-xs font-semibold">{t("common.worst_case")}</div>
                <div data-testid="climate-rain-wc" className={`text-xs text-muted-foreground mt-1 ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.downside_climate")}</div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white/70 p-4">
              <div data-testid="climate-temp-title" className="text-sm font-semibold">{t("risk.climate.temp")}</div>
              <div data-testid="climate-temp-range" className="mt-2 text-lg font-semibold">{t("tmpl.c", { min: r.tempStressC.min, max: r.tempStressC.max })}</div>
              <div data-testid="climate-temp-confidence" className="text-xs text-muted-foreground mt-1">{t("common.confidence")}: {r.tempStressC.confidence}%</div>
              <div className="mt-3 rounded-xl border bg-[#F1F8E9] p-3">
                <div className="text-xs font-semibold">{t("ui.downside_explanation")}</div>
                <div data-testid="climate-temp-wc" className={`text-xs text-muted-foreground mt-1 ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("ui.downside_climate")}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white/70 p-4">
            <div data-testid="climate-downside" className={`text-sm text-muted-foreground leading-relaxed ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>
              {t("ui.downside_climate")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
