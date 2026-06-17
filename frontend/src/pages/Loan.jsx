 import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Landmark, FileText, CheckCircle2, UploadCloud, Loader2, 
  ShieldCheck, Banknote, Fingerprint, User, Map, 
  CreditCard, Info, ArrowRight, Stamp, Gavel, Building2
} from 'lucide-react';

const LoanAccess = () => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState({});
  const [verified, setVerified] = useState({});
  const [formData, setFormData] = useState({
    accNumber: "",
    ifsc: "",
    branch: "",
    landSize: "",
    surveyNo: "",
    cropType: "Onion" // உங்களது விருப்பமான பயிர்
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [appId, setAppId] = useState(null);

  // நிஜ வாழ்க்கையில் தேவைப்படும் ஆவணங்கள் (Real-life Required Documents)
  const docList = [
    { id: 'aadhar', label: 'Aadhar Card (KYC)', sub: 'Identity & Permanent Address Proof' },
    { id: 'patta', label: 'Land Patta / Chitta', sub: 'Original Ownership Verification' },
    { id: 'adangal', label: 'Crop Adangal / VAO Certificate', sub: 'Current Season Cultivation Proof' },
    { id: 'passbook', label: 'Bank Passbook Front Page', sub: 'For DBT & Fund Transfer' }
  ];

  const handleUpload = (id) => {
    setUploading({ ...uploading, [id]: true });
    // AI Verification simulation - இது நிஜமான சரிபார்ப்பைப் பிரதிபலிக்கும்
    setTimeout(() => {
      setUploading(prev => ({ ...prev, [id]: false }));
      setVerified(prev => ({ ...prev, [id]: true }));
    }, 2500);
  };

  const allDocsVerified = docList.every(d => verified[d.id]);
  const isFormComplete = formData.accNumber && formData.ifsc && formData.landSize;

  const handleFinalSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAppId(`AGRI-CREDIT-${Math.floor(100000 + Math.random() * 900000)}`);
      setStep(3);
    }, 4000);
  };

  return (
    <div className="p-6 lg:p-12 bg-[#f8fcf9] min-h-screen font-sans animate-in fade-in">
      
      {/* 1. Agri-Bank Header */}
      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-green-50 mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-5">
          <div className="bg-green-700 p-5 rounded-[2rem] text-white shadow-xl shadow-green-100">
            <Landmark size={36}/>
          </div>
          <div>
            <h2 className="text-3xl font-black text-green-900 uppercase italic tracking-tighter">Farmers' Credit Portal</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic flex items-center gap-2">
              <ShieldCheck size={14} className="text-blue-500"/> Secure Banking Interface (Powered by AI)
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2.5 w-20 rounded-full transition-all duration-700 ${step >= s ? 'bg-green-600' : 'bg-slate-200'}`}></div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Application Flow */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Banking & Land Metadata */}
          <Card className="rounded-[3rem] shadow-2xl border-none overflow-hidden bg-white">
            <div className="bg-slate-900 p-8 text-white flex justify-between items-center">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                <Building2 className="text-green-400"/> Step 01: Bank & Land Details
              </h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank Audit Mode</span>
            </div>
            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 font-bold">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><CreditCard size={12}/> Account Number</label>
                <input type="text" placeholder="XXXX XXXX 1234" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-600 outline-none transition-all shadow-inner" onChange={(e) => setFormData({...formData, accNumber: e.target.value})}/>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info size={12}/> IFSC Code</label>
                <input type="text" placeholder="IFSC000XXXX" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-600 outline-none transition-all shadow-inner" onChange={(e) => setFormData({...formData, ifsc: e.target.value})}/>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Map size={12}/> Total Land Area (Acres)</label>
                <input type="number" placeholder="Enter acreage" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-600 outline-none transition-all shadow-inner" onChange={(e) => setFormData({...formData, landSize: e.target.value})}/>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Gavel size={12}/> Survey/Khasra Number</label>
                <input type="text" placeholder="e.g. 245/1A" className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-green-600 outline-none transition-all shadow-inner"/>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Document Scanning (Real-time Simulation) */}
          <Card className={`rounded-[3rem] shadow-2xl border-none overflow-hidden transition-all duration-700 ${isFormComplete ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
            <div className="bg-green-800 p-8 text-white">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-3">
                <UploadCloud className="text-yellow-400"/> Step 02: Digital Document Submission
              </h3>
            </div>
            <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {docList.map((doc) => (
                <div key={doc.id} className={`p-6 rounded-[2rem] border-2 transition-all duration-500 relative overflow-hidden ${verified[doc.id] ? 'border-green-500 bg-green-50' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className={`p-3 rounded-2xl ${verified[doc.id] ? 'bg-green-100 text-green-700' : 'bg-white text-slate-300 shadow-sm'}`}>
                      <FileText size={24}/>
                    </div>
                    {verified[doc.id] ? <CheckCircle2 size={24} className="text-green-600 animate-in zoom-in"/> : 
                     uploading[doc.id] ? <Loader2 size={24} className="text-blue-500 animate-spin"/> : 
                     <button onClick={() => handleUpload(doc.id)} className="p-2.5 bg-green-700 text-white rounded-xl shadow-lg hover:bg-green-800 transition-all"><UploadCloud size={18}/></button>}
                  </div>
                  <h4 className="font-black text-slate-800 uppercase text-[10px] mb-1 relative z-10">{doc.label}</h4>
                  <p className="text-[9px] font-bold text-slate-400 italic uppercase relative z-10">{verified[doc.id] ? "Verification Success" : doc.sub}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Section: Application Status */}
        <div className="space-y-6">
          <Card className="rounded-[4rem] shadow-2xl border-none overflow-hidden sticky top-8 bg-white p-12">
            <div className="text-center mb-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Application Health Index</p>
              <div className="relative w-44 h-44 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="#f1f5f9" strokeWidth="10" fill="none" />
                  <circle cx="50" cy="50" r="45" stroke="#15803d" strokeWidth="10" fill="none" strokeDasharray="283" strokeDashoffset={allDocsVerified ? "28" : "283"} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{allDocsVerified ? "92" : "0"}%</span>
                  <span className="text-[8px] font-black text-green-600 uppercase mt-1">Ready for Disbursement</span>
                </div>
              </div>
            </div>

            {step < 3 ? (
              <div className="space-y-6">
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex gap-4 text-[10px] font-bold text-blue-900 leading-relaxed italic">
                   <ShieldCheck size={28} className="shrink-0 text-blue-600"/>
                   Your application is being processed using Aravinth's AI Verification protocols.
                </div>
                <button 
                  disabled={!allDocsVerified || isProcessing}
                  onClick={handleFinalSubmit}
                  className={`w-full py-7 rounded-[2.5rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all ${allDocsVerified ? 'bg-green-700 text-white shadow-2xl shadow-green-100 hover:bg-green-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                >
                  {isProcessing ? <><Loader2 className="animate-spin"/> processing...</> : <><Fingerprint size={24}/> Biometric e-Sign</>}
                </button>
              </div>
            ) : (
              <div className="animate-in zoom-in-95 space-y-6">
                <div className="bg-green-800 p-10 rounded-[3rem] text-center text-white shadow-2xl">
                  <CheckCircle2 size={70} className="mx-auto mb-6"/>
                  <h4 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Credit Success</h4>
                  <p className="text-[10px] font-bold opacity-70 uppercase mt-5 tracking-widest">Amount Disbursed to Bank A/C</p>
                </div>
                <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Transaction Reference</p>
                  <p className="text-xl font-mono font-black text-slate-800 tracking-tighter">{appId}</p>
                  <div className="mt-5 flex justify-center items-center gap-2"><Stamp size={20} className="text-green-600"/><span className="text-[9px] font-black text-slate-400 uppercase">Aravinth Digitally Signed</span></div>
                </div>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default LoanAccess;