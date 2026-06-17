 import React from 'react';
import { ShieldCheck } from "lucide-react";

export default function Landing() {
  return (
    // 1. FULL SCREEN WRAPPER - NO SCROLL
    <div className="h-screen w-screen relative overflow-hidden bg-black font-sans">
      
      {/* 2. BACKGROUND IMAGE (Farmer in Paddy Field) */}
      <div className="absolute inset-0 z-0">
        {/* முக்கியம்: உங்கள் 'agri.jpg' படம் 'public' ஃபோல்டரில் இருக்க வேண்டும்.
           அப்போதுதான் இந்த லிங்க் (src="/agri.jpg") வேலை செய்யும்.
        */}
        <img 
          src="/agri.jpg" 
          alt="Farmer in Green Paddy Field" 
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // ஒருவேளை படம் கிடைக்கவில்லை என்றால், இந்த இணையதள படம் தானாக வரும் (Backup)
            e.target.src = "c:\Users\aravi\Pictures\agri.jpg";
          }}
        />

        {/* Light Overlay to ensure the logo is visible */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* 3. CLEAN HEADER (Logo Only - Left Side) */}
      <nav className="absolute top-0 w-full z-50 px-8 py-6 flex justify-start items-center">
        <div className="flex items-center gap-3">
          {/* Glowing Green Logo */}
          <div className="bg-[#4CAF50] p-3 rounded-2xl text-black shadow-[0_0_25px_rgba(76,175,80,0.7)] animate-pulse">
            <ShieldCheck size={32} strokeWidth={2.5} />
          </div>
          {/* Logo Text */}
          <div className="flex flex-col">
            <h1 className="font-heading text-2xl font-black text-white tracking-tighter uppercase drop-shadow-lg">
              AGRORISK AI+
            </h1>
          </div>
        </div>
      </nav>

    </div>
  );
}