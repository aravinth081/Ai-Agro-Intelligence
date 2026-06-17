import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useT } from "@/components/agro/TranslationProvider";
import { toast } from "@/components/ui/sonner";

export default function Login() {
  const { t, lang } = useT();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // MOCK: accept anything
    localStorage.setItem("agroRisk.session", JSON.stringify({ username, at: Date.now() }));
    toast.success(t("ui.sim_toast_signed_in"));
    nav("/profile");
  };

  return (
    <div data-testid="login-page" className="max-w-2xl">
      <Card className="rounded-3xl border border-border/60 bg-white/75 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className={`font-[Outfit] text-2xl ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("login.title")}</CardTitle>
          <div data-testid="login-subtitle" className={`text-sm text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("login.subtitle")}</div>
        </CardHeader>
        <CardContent>
          <form data-testid="login-form" className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label data-testid="login-username-label" className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>
                {t("login.username")}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-testid="login-username-input"
                  className="h-12 pl-9"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("login.username")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label data-testid="login-password-label" className={`text-sm font-medium ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  data-testid="login-password-input"
                  className="h-12 pl-9"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("login.password")}
                />
              </div>
            </div>

            <div data-testid="login-hint" className={`text-xs text-muted-foreground ${lang === "ta" ? "font-[Noto Sans Tamil]" : ""}`}>{t("login.hint")}</div>

            <Button data-testid="login-form-submit-button" type="submit" className="w-full h-12 rounded-2xl bg-[#1B5E20] hover:bg-[#1B5E20]/90">
              {t("login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
