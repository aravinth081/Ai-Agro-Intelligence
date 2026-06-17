 import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, CheckCircle2, Sprout, ShieldCheck, User, Clock, X, Lock, ListChecks } from 'lucide-react';

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminCreds, setAdminCreds] = useState({ user: "", pass: "" });
  const [allFeedbacks, setAllFeedbacks] = useState([]);

  // அட்மின் லாக்ஸை லோடு செய்தல்
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("adminFeedbacks") || "[]");
    setAllFeedbacks(data.reverse()); // லேட்டஸ்ட் முதலில் வரும்
  }, [submitted, isAdminLoggedIn]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    const existing = JSON.parse(localStorage.getItem("adminFeedbacks") || "[]");
    const newEntry = {
      id: Date.now(),
      farmer: "Aravinth",
      text: feedback,
      date: new Date().toLocaleString()
    };
    localStorage.setItem("adminFeedbacks", JSON.stringify([...existing, newEntry]));

    setSubmitted(true);
    setFeedback("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // லாகின் விவரங்கள்: admin / agri123
    if (adminCreds.user === "admin" && adminCreds.pass === "agri123") {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
    } else {
      alert("Wrong Admin Credentials!");
    }
  };

  return (
    <div className="p-8 bg-[#f8fcf9] min-h-screen flex flex-col items-center animate-in fade-in font-sans relative">
      
      {/* 1. Admin Login Pop-up Window */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[120] flex justify-center items-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-sm w-full p-10 border-t-8 border-green-700 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase text-green-900 italic tracking-tighter">Admin Access</h3>
              <button onClick={() => setShowAdminLogin(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input type="text" placeholder="Admin Username" onChange={e => setAdminCreds({...adminCreds, user: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-green-500 outline-none transition-all"/>
              <input type="password" placeholder="Access Password" onChange={e => setAdminCreds({...adminCreds, pass: e.target.value})} className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold focus:border-green-500 outline-none transition-all"/>
              <button type="submit" className="w-full bg-green-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-100 hover:bg-green-800 transition-all active:scale-95">
                <Lock size={18}/> Unlock Logs
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header with Icon Group */}
      <div className="w-full max-w-2xl mb-10 flex justify-between items-center bg-white/50 p-6 rounded-[2rem] border border-green-50 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-green-900 uppercase italic flex items-center gap-3 tracking-tighter">
            <MessageSquare size={36} className="text-green-600"/> Farmer Feedback
          </h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Digital Twin Optimization Hub</p>
        </div>
        
        {/* Icons Group: Admin Shield + Sprout Leaf */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAdminLogin(true)}
            className="p-3 bg-white shadow-md rounded-2xl text-green-600 hover:text-white hover:bg-green-600 transition-all border border-green-100 active:scale-90"
            title="Admin Login"
          >
            <ShieldCheck size={28} />
          </button>
          <div className="bg-green-100 p-3 rounded-2xl border border-green-200">
            <Sprout className="text-green-700" size={28}/>
          </div>
        </div>
      </div>

      {/* Main Container: Form View or Admin Data View */}
      <Card className="w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl border-t-[14px] border-green-600 overflow-hidden min-h-[500px]">
        <CardContent className="p-12 h-full flex flex-col">
          {isAdminLoggedIn ? (
            /* ADMIN LOGS VIEW (Visible only after login) */
            <div className="space-y-6 animate-in slide-in-from-bottom-4 flex flex-col h-full">
              <div className="flex justify-between items-center border-b-4 border-green-50 pb-6">
                <div>
                  <h3 className="text-2xl font-black text-green-900 uppercase italic tracking-tighter flex items-center gap-2"><ListChecks size={24}/> Feedback Logs</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Aravinth's Admin Dashboard</p>
                </div>
                <button onClick={() => setIsAdminLoggedIn(false)} className="bg-red-50 text-red-600 px-5 py-2 rounded-xl text-xs font-black uppercase border border-red-100 hover:bg-red-600 hover:text-white transition-all">Sign Out</button>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar flex-grow">
                {allFeedbacks.length > 0 ? allFeedbacks.map(fb => (
                  <div key={fb.id} className="bg-[#fcfdfc] p-6 rounded-[2rem] border-2 border-slate-50 border-l-[8px] border-l-green-600 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-center mb-3">
                       <span className="text-[10px] font-black text-green-700 uppercase flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full"><User size={12}/> {fb.farmer}</span>
                       <span className="text-[9px] font-black text-slate-300 uppercase italic flex items-center gap-2 tracking-widest"><Clock size={12}/> {fb.date}</span>
                    </div>
                    <p className="text-md font-bold text-slate-700 leading-relaxed italic group-hover:text-slate-900 transition-colors">"{fb.text}"</p>
                  </div>
                )) : (
                  <div className="text-center py-20">
                     <Sprout size={60} className="mx-auto text-slate-100 mb-4" />
                     <p className="text-slate-300 font-black uppercase italic tracking-widest">No messages found in the soil.</p>
                  </div>
                )}
              </div>
            </div>
          ) : !submitted ? (
            /* FARMER SUBMISSION VIEW */
            <form onSubmit={handleSubmit} className="space-y-8 flex flex-col h-full justify-between">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 italic">Detailed Experience Log</label>
                <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Analyze and share your thoughts about crop accuracy, market rates, or loan access..."
                  className="w-full h-64 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] p-10 text-slate-700 font-bold outline-none focus:border-green-500 transition-all resize-none shadow-inner placeholder:text-slate-300"
                />
              </div>
              <button type="submit" className="w-full bg-green-700 text-white py-6 rounded-[1.8rem] font-black uppercase flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:bg-green-800 active:scale-[0.98] transition-all tracking-[0.2em] text-lg">
                <Send size={24}/> Submit to Admin
              </button>
            </form>
          ) : (
            /* SUCCESS MESSAGE */
            <div className="py-20 text-center animate-in zoom-in-95 h-full flex flex-col justify-center">
               <div className="bg-green-50 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={70} className="text-green-500" />
               </div>
               <h3 className="text-4xl font-black text-green-950 uppercase italic tracking-tighter">Feedback Synced!</h3>
               <p className="text-slate-500 font-bold mt-4">Thank you, Aravinth. Our Agri-Admins will audit your log.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Feedback;