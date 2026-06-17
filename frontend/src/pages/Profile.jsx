 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, User, MapPin, Sprout, Landmark, Droplets, ShieldCheck, Briefcase } from 'lucide-react';

export const Profile = () => {
  const navigate = useNavigate();

  // --- States ---
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [landSize, setLandSize] = useState("");
  const [soilType, setSoilType] = useState("");
  const [crop, setCrop] = useState("");
  const [irrigation, setIrrigation] = useState(""); 
  const [loanSource, setLoanSource] = useState(""); 
  const [insurance, setInsurance] = useState("");   
  const [sideIncome, setSideIncome] = useState(""); 
  const [incomeAmount, setIncomeAmount] = useState(""); 

  useEffect(() => {
    const saved = localStorage.getItem("farmerProfile");
    if (saved) {
      const p = JSON.parse(saved);
      setName(p.name || "");
      setLocation(p.district || "");
      setLandSize(p.landSize || "");
      setSoilType(p.soilType || "");
      setCrop(p.crop || "");
      setIrrigation(p.irrigation || "");
      setLoanSource(p.loanSource || "");
      setInsurance(p.insurance || "");
      setSideIncome(p.sideIncome || "");
      setIncomeAmount(p.incomeAmount || "");
    }
  }, []);

  const handleSave = () => {
    const profileData = {
      name, 
      district: location, 
      landSize, 
      soilType, 
      crop, 
      irrigation,    
      loanSource,    
      insurance,     
      sideIncome,    
      incomeAmount
    };
    
    // 1. டேட்டாவைச் சேமிக்கிறோம்
    localStorage.setItem("farmerProfile", JSON.stringify(profileData));
    
    // 2. அலர்ட் மெசேஜ் இல்லாமல் நேரடியாக Dashboard-க்கு செல்கிறோம்
    navigate('/dashboard'); 
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen flex justify-center animate-in fade-in">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8">
        
        {/* Header */}
        <div className="mb-6 border-b pb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Farmer Digital Twin</h1>
            <p className="text-gray-500 text-sm">Update specific details for accurate AI Risk Analysis.</p>
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">AI Ready</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* --- LEFT SIDE: BASIC INFO --- */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 border-b pb-2">1. Basic Info</h3>

            <div>
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><User size={16}/> Farmer Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type Name" className="w-full mt-1 p-2 border rounded outline-none focus:ring-2 focus:ring-green-500"/>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2"><MapPin size={16}/> Location / City</label>
              <input list="loc-list" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Type City (e.g. Trichy)" className="w-full mt-1 p-2 border rounded outline-none focus:ring-2 focus:ring-green-500"/>
              <datalist id="loc-list">
                <option value="Thanjavur" /><option value="Madurai" /><option value="Kallakurichi" /><option value="Tiruchirappalli" /><option value="Coimbatore" />
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 text-xs">Land (Acres)</label>
                <input type="number" value={landSize} onChange={(e) => setLandSize(e.target.value)} className="w-full mt-1 p-2 border rounded outline-none"/>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 flex items-center gap-2 text-xs"><Sprout size={16}/> Soil Type</label>
                <input list="soil-list" value={soilType} onChange={(e) => setSoilType(e.target.value)} className="w-full mt-1 p-2 border rounded outline-none"/>
                <datalist id="soil-list"><option value="Red Soil" /><option value="Black Soil" /><option value="Clay" /></datalist>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Last Season Crop</label>
              <input list="crop-list" value={crop} onChange={(e) => setCrop(e.target.value)} placeholder="Select Crop" className="w-full mt-1 p-2 border rounded outline-none"/>
              <datalist id="crop-list"><option value="Paddy" /><option value="Sugarcane" /><option value="Cotton" /></datalist>
            </div>
          </div>

          {/* --- RIGHT SIDE: RISK FACTORS --- */}
          <div className="space-y-4">
            <h3 className="font-bold text-red-800 border-b pb-2">2. Risk Factors (Important)</h3>

            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Droplets size={16} className="text-blue-500"/> Irrigation Source</label>
              <input list="water-list" value={irrigation} onChange={(e) => setIrrigation(e.target.value)} placeholder="Select Source" className="w-full mt-1 p-2 border border-blue-200 rounded outline-none"/>
              <datalist id="water-list"><option value="Rain only" /><option value="Borewell" /><option value="Canal" /></datalist>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Landmark size={16} className="text-orange-500"/> Loan Source</label>
              <input list="loan-list" value={loanSource} onChange={(e) => setLoanSource(e.target.value)} placeholder="Select Source" className="w-full mt-1 p-2 border border-orange-200 rounded outline-none"/>
              <datalist id="loan-list"><option value="Bank" /><option value="Money Lender" /><option value="No Loan" /></datalist>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><ShieldCheck size={16} className="text-green-600"/> Crop Insurance?</label>
              <input list="ins-list" value={insurance} onChange={(e) => setInsurance(e.target.value)} placeholder="Yes / No" className="w-full mt-1 p-2 border border-green-200 rounded outline-none"/>
              <datalist id="ins-list"><option value="Yes" /><option value="No" /></datalist>
            </div>

            <div className="bg-gray-50 p-3 rounded border">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Briefcase size={16} className="text-purple-600"/> Side Income?</label>
              <div className="flex gap-2 mt-2">
                <input list="side-list" value={sideIncome} onChange={(e) => setSideIncome(e.target.value)} placeholder="Yes/No" className="w-1/2 p-2 border rounded outline-none"/>
                {sideIncome === "Yes" && <input type="number" value={incomeAmount} onChange={(e) => setIncomeAmount(e.target.value)} placeholder="₹ Amount" className="w-1/2 p-2 border rounded outline-none"/>}
              </div>
              <datalist id="side-list"><option value="Yes" /><option value="No" /></datalist>
            </div>

            <button 
              onClick={handleSave} 
              className="w-full bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-800 flex items-center justify-center gap-2 mt-6 shadow-lg transition-all"
            >
              <Save size={20}/> Save & Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;