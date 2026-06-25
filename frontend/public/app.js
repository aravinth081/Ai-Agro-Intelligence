 import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowRight, ShoppingCart, 
  BarChart3, TrendingUp, AlertTriangle, 
  ChevronRight, ArrowUpRight
} from "lucide-react";

export default function AgroRiskApp() {
  const [lang, setLang] = useState('ta'); // à®®à¯à®©à¯à®©à®¿à®°à¯à®ªà¯à®ªà®¾à®• à®¤à®®à®¿à®´à¯

  // à®ªà®¿à®©à¯à®©à®£à®¿ à®¸à¯à®Ÿà¯ˆà®²à¯ - Inline style à®®à¯‚à®²à®®à¯ à®ªà®Ÿà®¤à¯à®¤à¯ˆ à®‡à®£à¯ˆà®•à¯à®•à®¿à®±à¯‹à®®à¯
  const backgroundStyle = {
    // '/agriculture.jpeg' à®Žà®©à¯à®ªà®¤à¯ public à®ƒà®ªà¯‹à®²à¯à®Ÿà®°à¯ˆà®•à¯ à®•à¯à®±à®¿à®•à¯à®•à¯à®®à¯
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/agriculture.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
  };

  return (
    <div style={backgroundStyle} className={`w-full overflow-x-hidden ${lang === 'ta' ? 'font-tamil' : 'font-manrope'}`}>
      
      {/* 1. à®¨à¯‡à®µà®¿à®•à¯‡à®·à®©à¯ à®ªà®¾à®°à¯ (Glassmorphism) */}
      <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/10 backdrop-blur-xl px-6 md:px-16 py-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <div className="bg-[#1B5E20] p-2 rounded-lg text-white">
            <ShieldCheck size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">Agro Intelligence</span>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setLang(lang === 'ta' ? 'en' : 'ta')}
            className="px-4 py-2 border border-white/30 rounded-full font-bold hover:bg-white/10 transition-all text-sm"
          >
            {lang === 'ta' ? 'English' : 'à®¤à®®à®¿à®´à¯'}
          </button>
          <button className="bg-[#1B5E20] text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-[#4CAF50] transition-all">
            {lang === 'ta' ? 'à®‰à®³à¯à®¨à¯à®´à¯ˆ' : 'Login'}
          </button>
        </div>
      </nav>

      {/* 2. à®®à¯†à®¯à®¿à®©à¯ à®¹à¯€à®°à¯‹ à®šà¯†à®•à¯à®·à®©à¯ - à®ªà¯†à®£à¯à®Ÿà¯‹ à®•à®¿à®°à®¿à®Ÿà¯ */}
      <main className="p-6 md:p-12 lg:p-20 max-w-7xl mx-auto space-y-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* à®¹à¯€à®°à¯‹ à®•à®¾à®°à¯à®Ÿà¯ (Span 8) */}
          <div className="lg:col-span-8 rounded-[2.5rem] p-10 md:p-16 bg-white/90 backdrop-blur-md border border-white/40 shadow-2xl flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 bg-[#1B5E20]/10 text-[#1B5E20] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              <TrendingUp size={14} /> LIVE AGRI ANALYTICS
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
              {lang === 'ta' ? 'à®µà®¿à®µà®šà®¾à®¯à®¿à®•à®³à¯à®•à¯à®•à¯ ' : 'Smart Decisions for '}
              <span className="text-[#1B5E20]">{lang === 'ta' ? 'à®¤à¯à®²à¯à®²à®¿à®¯à®®à®¾à®© à®‡à®Ÿà®°à¯ à®®à¯‡à®²à®¾à®£à¯à®®à¯ˆ' : 'Smallholder Farmers.'}</span>
            </h1>
            <p className="text-xl text-[#525252] leading-relaxed mb-10 max-w-lg">
              {lang === 'ta' ? 'à®ªà®°à®¿à®¨à¯à®¤à¯à®°à¯ˆà®•à®³à¯ à®Žà®ªà¯à®ªà¯‹à®¤à¯à®®à¯ à®’à®°à¯ à®µà®°à®®à¯à®ªà®¾à®•à®µà¯‡ (70-85%) à®µà®´à®™à¯à®•à®ªà¯à®ªà®Ÿà¯à®®à¯. à®¨à¯€à®™à¯à®•à®³à¯ à®®à¯à®Ÿà®¿à®µà¯†à®Ÿà¯à®•à¯à®• à®¨à®¾à®™à¯à®•à®³à¯ à®‰à®¤à®µà¯à®•à®¿à®±à¯‹à®®à¯.' : 'Transparent risk ranges and downside explanations. Built to keep you in control.'}
            </p>
            <button className="w-fit bg-[#1B5E20] text-white px-10 py-5 rounded-full text-lg font-bold flex items-center gap-3 hover:gap-5 transition-all shadow-xl">
              {lang === 'ta' ? 'à®‡à®²à®µà®š à®Ÿà¯†à®®à¯‹ à®¤à¯Šà®Ÿà®™à¯à®•à¯' : 'Start Free Demo'} <ArrowRight size={22} />
            </button>
          </div>

          {/* à®šà®¨à¯à®¤à¯ˆ à®•à®¾à®°à¯à®Ÿà¯ (Span 4) */}
          <div className="lg:col-span-4 bg-[#795548] p-10 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between hover:opacity-90 transition-all cursor-pointer">
              <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">{lang === 'ta' ? 'à®šà®¨à¯à®¤à¯ˆ' : 'Marketplace'}</h3>
                <p className="text-white/80 font-medium">
                  {lang === 'ta' ? 'à®¨à¯‡à®°à®Ÿà®¿ à®•à¯Šà®³à¯à®®à¯à®¤à®²à¯ à®®à®±à¯à®±à¯à®®à¯ à®µà®¿à®²à¯ˆ à®¨à®¿à®²à®µà®°à®®à¯.' : 'Direct access to Paddy & Millet buyers.'}
                </p>
              </div>
          </div>
        </div>

        {/* 3. à®°à®¿à®¸à¯à®•à¯ à®•à®®à¯à®¯à¯‚à®©à®¿à®•à¯‡à®·à®©à¯ (Risk Monitor) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Low Risk */}
          <div className="bg-white p-8 rounded-3xl border-l-8 border-[#2E7D32] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#2E7D32] font-bold text-xs uppercase tracking-tighter">
              <ShieldCheck size={16} /> {lang === 'ta' ? 'à®•à¯à®±à¯ˆà®¨à¯à®¤ à®‡à®Ÿà®°à¯' : 'Low Risk'}
            </div>
            <p className="text-2xl font-bold text-gray-900">85-90% {lang === 'ta' ? 'à®¨à®®à¯à®ªà®•à®¤à¯à®¤à®©à¯à®®à¯ˆ' : 'Confidence'}</p>
            <p className="text-sm text-gray-500 font-medium">{lang === 'ta' ? 'à®®à®•à®šà¯‚à®²à¯ à®šà¯€à®°à®¾à®• à®‰à®³à¯à®³à®¤à¯.' : 'Expected yield is optimal.'}</p>
          </div>

          {/* Medium Risk */}
          <div className="bg-white p-8 rounded-3xl border-l-8 border-[#F57C00] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#F57C00] font-bold text-xs uppercase tracking-tighter">
              <AlertTriangle size={16} /> {lang === 'ta' ? 'à®šà®¨à¯à®¤à¯ˆ à®¨à®¿à®²à®µà®°à®®à¯' : 'Market Risk'}
            </div>
            <p className="text-2xl font-bold text-gray-900">â‚¹1,800 - â‚¹2,100</p>
            <p className="text-sm text-gray-500 font-medium">{lang === 'ta' ? 'à®µà®¿à®²à¯ˆ à®®à®¾à®±à¯à®±à®®à¯ à®à®±à¯à®ªà®Ÿà®²à®¾à®®à¯.' : 'Price range fluctuations.'}</p>
          </div>

          {/* High Risk / Worst Case */}
          <div className="bg-white p-8 rounded-3xl border-l-8 border-[#D32F2F] shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-[#D32F2F] font-bold text-xs uppercase tracking-tighter">
              <AlertTriangle size={16} /> {lang === 'ta' ? 'à®®à®¿à®• à®®à¯‹à®šà®®à®¾à®© à®¨à®¿à®²à¯ˆ' : 'Worst Case'}
            </div>
            <p className="text-2xl font-bold text-gray-900">15-20% {lang === 'ta' ? 'à®ªà®¾à®¤à®¿à®ªà¯à®ªà¯' : 'Risk'}</p>
            <p className="text-sm text-[#D32F2F] font-bold uppercase">{lang === 'ta' ? 'à®‰à®Ÿà®©à®Ÿà®¿ à®¨à®Ÿà®µà®Ÿà®¿à®•à¯à®•à¯ˆ à®¤à¯‡à®µà¯ˆ' : 'Action Required Now'}</p>
          </div>
        </div>
      </main>

      {/* 4. Visual Enhancer (Texture) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] z-50" />
      
      <footer className="p-12 text-center text-white/70 text-sm font-medium">
        Â© 2026 Agro Intelligence â€¢ {lang === 'ta' ? 'à®µà®¿à®µà®šà®¾à®¯ à®®à¯à®Ÿà®¿à®µà¯†à®Ÿà¯à®•à¯à®•à¯à®®à¯ à®¤à®³à®®à¯' : 'Professional Agri-Decision System'}
      </footer>
    </div>
  );
}
