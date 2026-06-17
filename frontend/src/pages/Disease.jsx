import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDatasets } from "@/components/agro/useDatasets";
import { getProfile } from "@/components/agro/storage";
import { computeIntegratedRisk } from "@/components/agro/riskEngine";
import { useT } from "@/components/agro/TranslationProvider";

export default function Disease() {
  const { t, lang } = useT();
  const { weather, disease, market, loading } = useDatasets();
  const profile = getProfile();

  const r = useMemo(() => {
    if (!weather || !disease || !market) return null;
    return computeIntegratedRisk({ profile, weather, disease, market, whatIf: null });
  }, [profile, weather, disease, market]);

  if (loading || !r) return <div data-testid="disease-loading" className="text-sm text-muted-foreground">{t("ui.loading")}</div>;

  return (
    <div data-testid="disease-page" className="space-y-6">
      <Card className="rounded-3xl border bg-white/75 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className={`font-[Outfit] text-2xl ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("disease.title")}</CardTitle>
          <div data-testid="disease-note" className={`text-sm text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("disease.note")}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge data-testid="disease-district" className="bg-white border">{r.district}</Badge>
            <Badge data-testid="disease-confidence" className="bg-[#F1F8E9] text-[#1B5E20] border border-[#1B5E20]/15">{t("common.confidence")}: {r.confidence}%</Badge>
          </div>

          <div className="rounded-2xl border bg-white/70 p-4">
            <div data-testid="disease-pressure-title" className="text-sm font-semibold">{t("risk.disease.severity")}</div>
            <div data-testid="disease-pressure-range" className="mt-2 text-lg font-semibold">{t("tmpl.pct", { min: r.diseasePressurePct.min, max: r.diseasePressurePct.max })}</div>
            <div data-testid="disease-pressure-confidence" className="text-xs text-muted-foreground mt-1">{t("common.confidence")}: {r.diseasePressurePct.confidence}%</div>

            <div className="mt-3 rounded-xl border bg-[#F1F8E9] p-3">
              <div className="text-xs font-semibold">{t("common.worst_case")}</div>
              <div data-testid="disease-wc" className="text-xs text-muted-foreground mt-1">
                {t("ui.downside_disease")}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white/70 p-4">
            <div data-testid="disease-downside" className={`text-sm text-muted-foreground leading-relaxed ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>
              {t("ui.downside_disease")}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
