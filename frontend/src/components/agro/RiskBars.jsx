import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { riskColorClass } from "@/components/agro/riskEngine";
import { useT } from "@/components/agro/TranslationProvider";

export const RiskBars = ({ label, value01, level, confidence, testIdPrefix }) => {
  const { t, lang } = useT();
  const pct = Math.round((value01 || 0) * 100);
  return (
    <div className="space-y-2" data-testid={`${testIdPrefix}-riskbar-wrapper`}>
      <div className="flex items-center justify-between gap-3">
        <div data-testid={`${testIdPrefix}-riskbar-label`} className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>
          {label}
        </div>
        <div className="flex items-center gap-2">
          <span data-testid={`${testIdPrefix}-risk-pill`} className={`ag-risk-pill ${riskColorClass(level)}`}>
            {level === "low" ? t("risk.level.low") : level === "high" ? t("risk.level.high") : t("risk.level.moderate")}
          </span>
          {typeof confidence === "number" ? (
            <Badge data-testid={`${testIdPrefix}-confidence-badge`} className="bg-white border">{t("common.confidence")}: {confidence}%</Badge>
          ) : null}
        </div>
      </div>
      <Progress data-testid={`${testIdPrefix}-progress`} value={pct} className="h-2" />
    </div>
  );
};
