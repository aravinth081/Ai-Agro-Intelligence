import AgroBot from './agro/AgroBot'; // <-- components folder kulla irundha ipdi irukkanum
import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Leaf, ShieldAlert, ShoppingBag, LineChart, HandCoins, UserRound, LayoutDashboard, SlidersHorizontal, MessageSquareQuote, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/components/agro/TranslationProvider";
import AgroBot from './components/agro/AgroBot'; // <-- Idhu madhiri irukkanum

const navItems = [
  { to: "/", key: "nav.landing", icon: Leaf },
  { to: "/login", key: "nav.login", icon: LogIn },
  { to: "/profile", key: "nav.profile", icon: UserRound },
  { to: "/dashboard", key: "nav.dashboard", icon: LayoutDashboard },
  { to: "/simulator", key: "nav.simulator", icon: SlidersHorizontal },
  { to: "/marketplace", key: "nav.marketplace", icon: ShoppingBag },
  { to: "/market", key: "nav.market", icon: LineChart },
  { to: "/feedback", key: "nav.feedback", icon: MessageSquareQuote },
  { to: "/loan", key: "nav.loan", icon: HandCoins },
];

export const AppShell = ({ children }) => {
  const { t, lang, setLang } = useT();
  const loc = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div data-testid="app-shell" className="min-h-screen relative">
      <div className="pointer-events-none fixed inset-0 opacity-[0.055] mix-blend-multiply" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"160\" height=\"160\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"2\" stitchTiles=\"stitch\"/></filter><rect width=\"160\" height=\"160\" filter=\"url(%23n)\" opacity=\"0.35\"/></svg>')" }} />

      <header data-testid="top-nav" className="sticky top-0 z-40 border-b border-border/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 flex items-center gap-3">
          <button
            data-testid="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link data-testid="brand-home-link" to="/" className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-[#1B5E20] text-white flex items-center justify-center shadow-sm">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-[Outfit] text-[15px] md:text-[16px] font-bold tracking-tight">{t("app.name")}</div>
              <div data-testid="pitch-line" className="text-xs text-muted-foreground">{t("app.pitch")}</div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Badge data-testid="rule-based-badge" className="bg-[#F1F8E9] text-[#1B5E20] border border-[#1B5E20]/20">RULE‑BASED • DEMO</Badge>
            <div className="hidden md:flex items-center gap-1 rounded-full border bg-white/60 px-2 py-1">
              <span className="text-xs text-muted-foreground px-2">{t("common.language")}</span>
              <Button
                data-testid="lang-en-button"
                size="sm"
                variant={lang === "en" ? "default" : "outline"}
                className={lang === "en" ? "rounded-full bg-[#1B5E20] hover:bg-[#1B5E20]/90" : "rounded-full"}
                onClick={() => setLang("en")}
              >
                {t("common.english")}
              </Button>
              <Button
                data-testid="lang-ta-button"
                size="sm"
                variant={lang === "ta" ? "default" : "outline"}
                className={lang === "ta" ? "rounded-full bg-[#1B5E20] hover:bg-[#1B5E20]/90" : "rounded-full"}
                onClick={() => setLang("ta")}
              >
                {t("common.tamil")}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside data-testid="side-nav" className={`lg:col-span-3 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
          <nav className="sticky top-[84px]">
            <div className="rounded-2xl border bg-white/70 backdrop-blur-xl shadow-sm p-2">
              <div className="md:hidden flex items-center justify-between px-2 py-2">
                <div className="text-xs text-muted-foreground">Menu</div>
                <div className="flex items-center gap-1">
                  <Button data-testid="lang-en-button-mobile" size="sm" variant={lang === "en" ? "default" : "outline"} className={lang === "en" ? "bg-[#1B5E20] hover:bg-[#1B5E20]/90" : ""} onClick={() => setLang("en")}>
                    EN
                  </Button>
                  <Button data-testid="lang-ta-button-mobile" size="sm" variant={lang === "ta" ? "default" : "outline"} className={lang === "ta" ? "bg-[#1B5E20] hover:bg-[#1B5E20]/90" : ""} onClick={() => setLang("ta")}>
                    TA
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-1 gap-1">
                {navItems.map((it) => {
                  const Icon = it.icon;
                  const active = loc.pathname === it.to;
                  return (
                    <NavLink
                      data-testid={`nav-${it.to.replace("/", "").replace(/\//g, "-") || "home"}`}
                      key={it.to}
                      to={it.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                          isActive || active
                            ? "bg-[#F1F8E9] text-[#1B5E20] border border-[#1B5E20]/15"
                            : "hover:bg-black/[0.04] text-foreground",
                        ].join(" ")
                      }
                    >
                      <Icon className="h-4 w-4" />
                      <span className={lang === "ta" ? "font-[Noto Sans Tamil]" : ""}>{t(it.key)}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="px-3 py-3">
                <div data-testid="uncertainty-disclaimer" className="text-xs text-muted-foreground leading-relaxed">
                  {t("common.not_a_guarantee")}
                </div>
              </div>
            </div>
          </nav>
        </aside>

        <main data-testid="main-content" className="lg:col-span-9">
          {children}
        </main>
      </div>
    </div>
  );
};
