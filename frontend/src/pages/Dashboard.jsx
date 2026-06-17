 import React, { useEffect, useState } from 'react';
import { fetchAllLiveData } from '../services/api'; 
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MapPin, Sprout, X, Lightbulb, Zap, Newspaper, TrendingUp, ArrowRight, LineChart, CloudRain, Clock, ArrowUpRight, Droplets, FlaskConical } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [farmerInfo, setFarmerInfo] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null); 
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem("farmerProfile");
    let currentLocation = "Salem"; 
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setFarmerInfo(parsed);
      if (parsed.district) currentLocation = parsed.district;
    }
    fetchAllLiveData(currentLocation).then(res => setData(res));
  }, []);

  if (!data) return (
    <div className="flex h-screen justify-center items-center bg-[#f8fcf9] text-green-800 font-bold">
      <Loader2 className="animate-spin h-10 w-10 mr-2"/> Syncing Market Intel...
    </div>
  );

  const typedCrop = farmerInfo?.crop || "";
  const matchedCrop = data?.marketRates?.find(item => 
    item.crop.toLowerCase().trim() === typedCrop.toLowerCase().trim()
  );

  // Daily Market Report Details for Modal
  const dailyNewsReport = [
    { time: "09:00 AM", update: `Market opened with high demand for ${matchedCrop?.crop || 'selected crops'}.` },
    { time: "01:30 PM", update: "Arrivals from nearby districts are 20% lower than yesterday." },
    { time: "04:00 PM", update: "Closing marks show a steady upward trend for the next 48 hours." }
  ];

  const detailInfo = {
    profit: { title: "Profit Range", value: matchedCrop?.profitRange || "20-25%", color: "text-green-600", desc: "Estimated margins based on current market demand." },
    loss: { title: "Loss Risk", value: matchedCrop?.lossRange || "2-5%", color: "text-red-600", desc: "Risk factors from localized pest outbreaks." },
    status: { title: "Market Status", value: matchedCrop?.marketStatus || "Bullish", color: "text-orange-600", desc: "Market sentiment is currently favorable." }
  };

  return (
    <div className="p-6 space-y-6 bg-[#f8fcf9] min-h-screen text-slate-800 animate-in fade-in font-sans relative">
      
      {/* 1. Daily Market Report Modal */}
      {showFullReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex justify-center items-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-8 border-t-[12px] border-blue-900 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black uppercase italic text-blue-900 flex items-center gap-2">
                <LineChart size={28}/> Daily Intel Report
              </h3>
              <button onClick={() => setShowFullReport(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            
            <div className="space-y-4 mb-6 font-bold text-slate-700">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">Today's Market Marks</p>
                {dailyNewsReport.map((news, idx) => (
                    <div key={idx} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <Clock className="text-blue-600 shrink-0" size={18}/>
                        <div>
                            <p className="text-[10px] font-black text-blue-500">{news.time}</p>
                            <p className="text-sm">{news.update}</p>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={() => setShowFullReport(false)} className="w-full bg-blue-900 text-white py-4 rounded-2xl font-black uppercase">Close Report</button>
          </div>
        </div>
      )}

      {/* 2. Analyze Detail Modal */}
      {activeDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[110] flex justify-center items-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 border border-green-100 animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-black uppercase italic text-slate-900">{detailInfo[activeDetail].title}</h3>
              <button onClick={() => setActiveDetail(null)} className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
            </div>
            <p className={`text-5xl font-black mb-4 ${detailInfo[activeDetail].color}`}>{detailInfo[activeDetail].value}</p>
            <p className="text-slate-600 leading-relaxed font-bold italic">"{detailInfo[activeDetail].desc}"</p>
            <button onClick={() => setActiveDetail(null)} className="mt-8 w-full bg-green-700 text-white py-4 rounded-2xl font-black">CLOSE</button>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-[2rem] shadow-sm border border-green-100 gap-4">
        <div>
          <h1 className="text-3xl font-black text-green-900 uppercase flex items-center gap-2 italic tracking-tighter">
            <Sprout className="text-green-600" size={32}/> Agri-Twin Intel
          </h1>
          <p className="text-blue-600 flex items-center gap-1 text-[10px] font-black uppercase mt-1 italic tracking-[0.2em]">
            <MapPin size={12}/> Satellite Active: {data.weather.location}
          </p>
        </div>
        <div className="bg-green-700 px-6 py-2 rounded-xl text-white font-black uppercase text-sm shadow-lg shadow-green-100">
            Farmer: {farmerInfo?.name || "aravinth"}
        </div>
      </div>
      
      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Top Analytics */}
        <div className="lg:col-span-3">
          <Card className="bg-white border-green-200 shadow-xl overflow-hidden border-t-[12px] border-t-green-600 rounded-[2.5rem] h-full">
            <CardContent className="p-10">
              <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-50 pb-8 gap-4">
                <div>
                  <span className="bg-green-100 text-green-700 text-[10px] px-3 py-1 rounded-full font-black uppercase border border-green-200">Twin Match Active</span>
                  <h2 className="text-8xl font-black mt-2 uppercase text-green-950 italic tracking-tighter">{matchedCrop?.crop || "N/A"}</h2>
                </div>
                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-right min-w-[220px]">
                  <p className="text-6xl font-mono font-black text-green-700 leading-none italic tracking-tighter">{matchedCrop?.price.split(' ')[0] || "₹0"}</p>
                  <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-[4px]">Live Market Rate</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                {['profit', 'loss', 'status'].map((key) => (
                  <div key={key} onClick={() => setActiveDetail(key)} className="bg-white p-6 rounded-[2rem] border border-slate-100 text-center hover:shadow-2xl hover:border-green-200 transition-all cursor-pointer group">
                    <p className="text-slate-400 text-[10px] font-black uppercase mb-1">{detailInfo[key].title.split(' ')[0]}</p>
                    <p className={`text-4xl font-black ${detailInfo[key].color}`}>{detailInfo[key].value}</p>
                    <p className="text-[9px] text-slate-400 font-bold mt-2 italic uppercase underline decoration-2">Analyze Detail</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-purple-200 shadow-xl p-8 rounded-[2.5rem] border-t-[10px] border-t-purple-600 h-full flex flex-col justify-between">
             <div className="space-y-6 font-bold">
                <p className="text-[10px] font-black uppercase text-purple-700 tracking-[4px] border-b border-purple-50 pb-3">Twin Profile Match</p>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Irrigation</p>
                   <p className="text-xl font-black text-slate-900 uppercase leading-none italic">{farmerInfo?.irrigation || "Borewell"}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest">Financial Risk</p>
                   <p className={`text-xl font-black uppercase leading-none ${farmerInfo?.loanSource?.includes('Lender') ? 'text-red-600' : 'text-green-600'}`}>{farmerInfo?.loanSource || "Stable"}</p>
                </div>
             </div>
             <div className="bg-slate-950 p-6 rounded-[2rem] shadow-2xl text-center border border-slate-800 mt-4">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Live Temp</p>
                <p className="text-5xl font-black text-white italic tracking-tighter">{data.weather.temp}</p>
             </div>
          </Card>
        </div>

        {/* BOTTOM EQUAL HEIGHT CARDS */}
        <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          
          {/* AGRI-GUIDE (3 POINTS ADDED) */}
          <Card className="bg-white shadow-xl border-l-[12px] border-l-blue-600 p-8 rounded-[2.5rem] h-full flex flex-col">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-blue-800 flex items-center gap-2 uppercase tracking-tighter italic font-bold"><Lightbulb size={24}/> Agri-Guide</h3>
                <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">Dynamic</span>
             </div>
             <div className="space-y-4 flex-grow font-bold text-slate-700">
                <div className="flex gap-3 items-start border-l-2 border-blue-500/30 pl-4 py-1">
                   <Droplets className="text-blue-500 shrink-0 mt-0.5" size={16}/>
                   <p className="text-sm italic">"Well-drained sandy loam soil is best for crop bulbs."</p>
                </div>
                <div className="flex gap-3 items-start border-l-2 border-blue-500/30 pl-4 py-1">
                   <CloudRain className="text-blue-500 shrink-0 mt-0.5" size={16}/>
                   <p className="text-sm italic">"Temperatures stable for the next 72 hour cycle."</p>
                </div>
                <div className="flex gap-3 items-start border-l-2 border-blue-500/30 pl-4 py-1">
                   <FlaskConical className="text-blue-500 shrink-0 mt-0.5" size={16}/>
                   <p className="text-sm italic">"Apply balanced organic fertilizers for higher yield."</p>
                </div>
             </div>
          </Card>

          {/* Market News (3 Points) */}
          <Card className="bg-[#0f172a] text-white shadow-xl p-8 rounded-[2.5rem] h-full relative overflow-hidden flex flex-col border-none">
             <h4 className="text-lg font-black uppercase flex items-center gap-2 text-blue-400 mb-6 relative z-10 font-bold italic"><Newspaper size={20}/> Market News</h4>
             <div className="space-y-4 flex-grow relative z-10 font-bold">
                <div className="flex gap-3 items-start"><TrendingUp size={16} className="text-blue-400 shrink-0 mt-1"/><p className="text-sm text-slate-300 italic">Export demand for crops is increasing globally.</p></div>
                <div className="flex gap-3 items-start"><Zap size={16} className="text-blue-400 shrink-0 mt-1"/><p className="text-sm text-slate-300 italic">New government subsidies for fertilizers announced.</p></div>
                <div className="flex gap-3 items-start"><Clock size={16} className="text-blue-400 shrink-0 mt-1"/><p className="text-sm text-slate-300 italic">Market arrivals peaking in neighboring mandis.</p></div>
             </div>
             <button 
                onClick={() => setShowFullReport(true)}
                className="text-[10px] font-black uppercase text-blue-400 underline tracking-[3px] mt-6 flex items-center gap-1 relative z-10 hover:text-white transition-colors"
             >
                Read full report <ArrowRight size={10}/>
             </button>
             <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12"><Newspaper size={100}/></div>
          </Card>

          {/* AI Priority Alert */}
          <Card className="bg-green-900 text-white shadow-2xl p-8 rounded-[2.5rem] h-full flex flex-col justify-between relative overflow-hidden border-none">
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-4 py-1 rounded-full font-bold">
                   <Zap size={16} className="text-green-400 fill-green-400"/><h4 className="font-black uppercase tracking-[0.2em] text-[9px] text-green-400">AI Priority Alert</h4>
                </div>
                <p className="text-2xl font-black italic leading-tight uppercase tracking-tight">"Prices expected to rise in 10 days. Plan your harvest."</p>
             </div>
             <div className="absolute -bottom-10 -right-10 opacity-5"><Zap size={220}/></div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;