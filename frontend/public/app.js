 import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, ShoppingCart, 
  BarChart3, TrendingUp, AlertTriangle, 
  ChevronRight, ArrowUpRight
} from "lucide-react";

export default function AgroRiskApp() {
  const [lang, setLang] = useState('ta'); // முன்னிருப்பாக தமிழ்

  // பின்னணி ஸ்டைல் - Inline style மூலம் படத்தை இணைக்கிறோம்
  const backgroundStyle = {
    // '/agriculture.jpeg' என்பது public ஃபோல்டரைக் குறிக்கும்
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/agriculture.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
  };

  return (
    <div style={backgroundStyle} className={`w-full overflow-x-hidden ${lang === 'ta' ? 'font-tamil' : 'font-manrope'}`}>
      
      {/* 1. நேவிகேஷன் பார் (Glassmorphism) */}
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl px-6 md:px-16 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="bg-[#1B5E20] p-2 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">AGRORISK AI+</span>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            className="px-4 py-2 border border-white/30 rounded-full font-bold hover:bg-white/10 transition-all text-sm"
          >
            {lang === 'ta' ? 'English' : 'தமிழ்'}
          </button>
          <button className="bg-[#1B5E20] text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-[#4CAF50] transition-all">
            {lang === 'ta' ? 'உள்நுழை' : 'Login'}
          </button>
        </div>
      </nav>

      {/* 2. மெயின் ஹீரோ செக்ஷன் - பெண்டோ கிரிட் */}
      <main className="p-6 md:p-12 lg:p-20 max-w-7xl mx-auto space-y-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ஹீரோ கார்டு (Span 8) */}
          <div className="lg:col-span-8 rounded-[2.5rem] p-10 md:p-16 bg-white/90 backdrop-blur-md border border-white/40 shadow-2xl flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#1B5E20]/10 text-[#1B5E20] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <TrendingUp size={14} /> LIVE AGRI ANALYTICS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
              {lang === 'ta' ? 'விவசாயிகளுக்கு ' : 'Smart Decisions for '}
              <span className="text-[#1B5E20]">{lang === 'ta' ? 'துல்லியமான இடர் மேலாண்மை' : 'Smallholder Farmers.'}</span>
            </h1>
            <p className="text-xl text-[#525252] leading-relaxed mb-10 max-w-lg">
              {lang === 'ta' ? 'பரிந்துரைகள் எப்போதும் ஒரு வரம்பாகவே (70-85%) வழங்கப்படும். நீங்கள் முடிவெடுக்க நாங்கள் உதவுகிறோம்.' : 'Transparent risk ranges and downside explanations. Built to keep you in control.'}
            </p>
            <button className="w-fit bg-[#1B5E20] text-white px-10 py-5 rounded-full text-lg font-bold flex items-center gap-3 hover:gap-5 transition-all shadow-xl">
              {lang === 'ta' ? 'இலவச டெமோ தொடங்கு' : 'Start Free Demo'} <ArrowRight size={22} />
            </button>
          </div>

          {/* சந்தை கார்டு (Span 4) */}
          <div className="lg:col-span-4 bg-[#795548] p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between hover:opacity-90 transition-all cursor-pointer">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{lang === 'ta' ? 'சந்தை' : 'Marketplace'}</h3>
                <p className="text-white/80 font-medium">
                  {lang === 'ta' ? 'நேரடி கொள்முதல் மற்றும் விலை நிலவரம்.' : 'Direct access to Paddy & Millet buyers.'}
                </p>
              </div>
          </div>
        </div>

        {/* 3. ரிஸ்க் கம்யூனிகேஷன் (Risk Monitor) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Low Risk */}
          <div className="bg-white p-8 rounded-3xl border-l-8 border-[#2E7D32] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#2E7D32] font-bold text-xs uppercase tracking-tighter">
              <ShieldCheck size={16} /> {lang === 'ta' ? 'குறைந்த இடர்' : 'Low Risk'}
            </div>
            <p className="text-2xl font-bold text-gray-900">85-90% {lang === 'ta' ? 'நம்பகத்தன்மை' : 'Confidence'}</p>
            <p className="text-sm text-gray-500 font-medium">{lang === 'ta' ? 'மகசூல் சீராக உள்ளது.' : 'Expected yield is optimal.'}</p>
          </div>

          {/* Medium Risk */}
          <div className="bg-white p-8 rounded-3xl border-l-8 border-[#F57C00] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#F57C00] font-bold text-xs uppercase tracking-tighter">
              <AlertTriangle size={16} /> {lang === 'ta' ? 'சந்தை நிலவரம்' : 'Market Risk'}
            </div>
            <p className="text-2xl font-bold text-gray-900">₹1,800 - ₹2,100</p>
            <p className="text-sm text-gray-500 font-medium">{lang === 'ta' ? 'விலை மாற்றம் ஏற்படலாம்.' : 'Price range fluctuations.'}</p>
          </div>

          {/* High Risk / Worst Case */}
          <div className="bg-white p-8 rounded-3xl border-l-8 border-[#D32F2F] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#D32F2F] font-bold text-xs uppercase tracking-tighter">
              <AlertTriangle size={16} /> {lang === 'ta' ? 'மிக மோசமான நிலை' : 'Worst Case'}
            </div>
            <p className="text-2xl font-bold text-gray-900">15-20% {lang === 'ta' ? 'பாதிப்பு' : 'Risk'}</p>
            <p className="text-sm text-[#D32F2F] font-bold uppercase">{lang === 'ta' ? 'உடனடி நடவடிக்கை தேவை' : 'Action Required Now'}</p>
          </div>
        </div>
      </main>

      {/* 4. Visual Enhancer (Texture) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-50" />
      
      <footer className="p-12 text-center text-white/70 text-sm font-medium">
        © 2026 AgroRisk AI+ • {lang === 'ta' ? 'விவசாய முடிவெடுக்கும் தளம்' : 'Professional Agri-Decision System'}
      </footer>
    </div>
  );
}