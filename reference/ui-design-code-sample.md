import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplets, 
  Thermometer,
  Layers, 
  Pill, 
  FlaskConical, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Bell,
  Navigation,
  User,
  Search,
  Zap,
  Wind,
  Plus,
  Clock,
  Heart
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- Mock Data ---
const DIAGNOSIS_DATA = {
  subtype: "Nummular Atopic Dermatitis",
  confidence: 94,
  description: "The skin shows signs of acute inflammation and high dryness, consistent with circular eczematous lesions. [Ref: ICD-11 EK00.1, Fitzpatrick Dermatology Vol. 9]",
  metrics: [
    { label: "Redness", value: 7, status: "Moderate", icon: <Activity size={18} className="text-red-500" /> },
    { label: "Scaling", value: 3, status: "Mild", icon: <Layers size={18} className="text-amber-500" /> },
    { label: "Swelling", value: 9, status: "Severe", icon: <Droplets size={18} className="text-blue-500" /> },
    { label: "Itching", value: 10, status: "Severe", icon: <Zap size={18} className="text-purple-500" /> },
    { label: "Roughness", value: 6, status: "Moderate", icon: <Wind size={18} className="text-gray-500" /> }
  ],
  treatments: [
    { id: 1, type: "Pill", name: "Antihistamine", dosage: "10mg morning", icon: <Pill size={20} /> },
    { id: 2, type: "Topical", name: "Hydrocortisone", dosage: "Apply twice daily", icon: <FlaskConical size={20} /> }
  ],
  referral: {
    doctor: "Dr. Jane Smith",
    hospital: "Seoul National University Hospital",
    distance: "0.8km away"
  }
};

// --- Sub-Components ---

const FadeInCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className="bg-white rounded-[16px] p-6 mb-5 shadow-[0px_4px_12px_rgba(0,0,0,0.05)] border border-gray-50"
  >
    {children}
  </motion.div>
);

const ConfidenceBadge = ({ percentage }) => {
  const isHigh = percentage > 80;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isHigh ? 'bg-[#50C878]/10 text-[#50C878]' : 'bg-amber-100 text-amber-600'}`}>
      {percentage}% Match
    </span>
  );
};

const SeverityScale = ({ status, value }) => {
  const getActiveColor = (val) => {
    if (val <= 3) return "bg-[#50C878]";
    if (val <= 7) return "bg-[#4A90E2]";
    return "bg-red-400";
  };

  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-[9px] text-gray-400 mb-1.5 uppercase tracking-widest font-bold px-1">
        <span className={value <= 3 ? 'text-[#50C878]' : ''}>Mild</span>
        <span className={value > 3 && value <= 7 ? 'text-[#4A90E2]' : ''}>Moderate</span>
        <span className={value > 7 ? 'text-red-400' : ''}>Severe</span>
      </div>
      <div className="flex gap-1 h-3 w-full mb-3">
        {[...Array(10)].map((_, i) => {
          const blockNum = i + 1;
          const isActive = blockNum === value;
          return (
            <motion.div
              key={blockNum}
              animate={{ scaleY: isActive ? 1.2 : 1, opacity: isActive ? 1 : 0.2 }}
              className={`flex-1 rounded-sm ${isActive ? getActiveColor(blockNum) : 'bg-gray-300'}`}
            />
          );
        })}
      </div>
      <div className="flex justify-between items-start px-0.5">
        {[...Array(10)].map((_, i) => {
          const num = i + 1;
          const isActive = num === value;
          return (
            <div key={num} className="flex flex-col items-center flex-1">
              <div className={`w-px h-1 mb-1 transition-colors ${isActive ? 'bg-gray-800 h-2' : 'bg-gray-200'}`} />
              <span className={`text-[10px] font-bold transition-all ${isActive ? 'text-gray-900 scale-125' : 'text-gray-300'}`}>
                {num}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [reminders, setReminders] = useState({});
  const [selectedFeelings, setSelectedFeelings] = useState([]);
  const [onPeriod, setOnPeriod] = useState(false);
  const [logCompliance, setLogCompliance] = useState({ pill: false, ointment: false });

  const feelings = ["Itchiness", "Stinging", "Dryness", "Burning", "Sensitive", "Normal"];

  const toggleFeeling = (feeling) => {
    setSelectedFeelings(prev => 
      prev.includes(feeling) ? prev.filter(f => f !== feeling) : [...prev, feeling]
    );
  };

  const toggleReminder = (id) => {
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900 pb-10">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F8F9FA]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Patient Portal</h1>
          <p className="font-bold text-lg">Daily Care</p>
        </div>
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          <User size={20} className="text-[#4A90E2]" />
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pt-2">
        
        {/* Card #1: Active Treatment */}
        <FadeInCard delay={0}>
          <div className="bg-[#F0F7FF] -m-6 p-6 rounded-[16px]">
            <h2 className="text-sm font-bold text-gray-400 uppercase mb-5 tracking-tight">Active Treatment</h2>
            <div className="space-y-3">
              {DIAGNOSIS_DATA.treatments.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-[12px] flex items-center justify-between shadow-sm border border-blue-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#4A90E2]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-800">{item.name}</h4>
                      <p className="text-[11px] text-gray-500 font-medium uppercase">{item.dosage}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleReminder(item.id)}
                    className={`p-2 rounded-full transition-colors ${reminders[item.id] ? 'bg-[#50C878] text-white' : 'bg-gray-100 text-gray-400'}`}
                  >
                    <Bell size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-3 border-2 border-dashed border-blue-200 rounded-xl flex items-center justify-center gap-2 text-[#4A90E2] text-sm font-bold bg-white/50 hover:bg-white transition-colors">
              <CheckCircle2 size={18} />
              Log Daily Usage
            </button>
          </div>
        </FadeInCard>

        {/* NEW Card: User Status Update (Daily Input) */}
        <FadeInCard delay={0.05}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-tight">Status Update</h2>
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#4A90E2] bg-blue-50 px-2 py-1 rounded">
              <Clock size={12} />
              JUST NOW
            </div>
          </div>

          {/* Feeling Selection */}
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">Current Feelings</p>
            <div className="flex flex-wrap gap-2">
              {feelings.map(feeling => (
                <button
                  key={feeling}
                  onClick={() => toggleFeeling(feeling)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                    selectedFeelings.includes(feeling)
                      ? 'bg-[#4A90E2] text-white border-[#4A90E2] shadow-md shadow-blue-100'
                      : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                  }`}
                >
                  {feeling}
                </button>
              ))}
            </div>
          </div>

          {/* Treatment Check & Factors */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Medical Log</p>
            
            <label className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${logCompliance.pill ? 'bg-[#50C878] text-white' : 'bg-gray-200 text-gray-400'}`}>
                   <Pill size={16} />
                </div>
                <span className="text-sm font-bold text-gray-700">Took Prescribed Pill</span>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                checked={logCompliance.pill}
                onChange={() => setLogCompliance(prev => ({...prev, pill: !prev.pill}))}
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50 cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${logCompliance.ointment ? 'bg-[#50C878] text-white' : 'bg-gray-200 text-gray-400'}`}>
                   <FlaskConical size={16} />
                </div>
                <span className="text-sm font-bold text-gray-700">Applied Ointment</span>
              </div>
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                checked={logCompliance.ointment}
                onChange={() => setLogCompliance(prev => ({...prev, ointment: !prev.ointment}))}
              />
            </label>

            <div className="h-px bg-gray-100 w-full my-2" />

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Heart size={18} className={onPeriod ? "text-pink-400" : "text-gray-300"} />
                <span className="text-sm font-bold text-gray-600">Menstrual Cycle (Period)</span>
              </div>
              <button 
                onClick={() => setOnPeriod(!onPeriod)}
                className={`w-12 h-6 rounded-full relative transition-colors ${onPeriod ? 'bg-pink-400' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${onPeriod ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <button className="w-full mt-6 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-black transition-all">
            Save Daily Report
          </button>
        </FadeInCard>

        {/* Card #3: Diagnosis Summary */}
        <FadeInCard delay={0.1}>
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-tight">Analysis Result</h2>
            <ConfidenceBadge percentage={DIAGNOSIS_DATA.confidence} />
          </div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800 leading-tight italic">{DIAGNOSIS_DATA.subtype}</h3>
          </div>
          <div className="flex justify-center items-center gap-6 mb-4">
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full border-4 border-[#4A90E2]/20 overflow-hidden relative bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 to-red-100 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-red-400/30 blur-md" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">User Photo</span>
            </div>
            <div className="h-px w-8 bg-gray-100" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-full border-4 border-[#50C878]/20 overflow-hidden relative bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-pink-300 to-red-200 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-500/40 blur-lg" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Reference</span>
            </div>
          </div>
        </FadeInCard>

        {/* Card #4: Symptom Breakdown */}
        <FadeInCard delay={0.2}>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-6 tracking-tight">Symptom Breakdown</h2>
          <div className="space-y-12 mb-8">
            {DIAGNOSIS_DATA.metrics.map((metric, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="font-bold text-sm text-gray-700">{metric.label}</span>
                  </div>
                </div>
                <SeverityScale status={metric.status} value={metric.value} />
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border-l-4 border-[#4A90E2]">
            <p className="text-sm text-gray-600 leading-relaxed italic">"{DIAGNOSIS_DATA.description}"</p>
          </div>
        </FadeInCard>

        {/* Card #5: Clinical Referral & Logistics */}
        <FadeInCard delay={0.3}>
          <h2 className="text-sm font-bold text-gray-400 uppercase mb-5 tracking-tight">Recommended Care</h2>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">{DIAGNOSIS_DATA.referral.doctor}</h3>
            <div className="flex items-center gap-1 text-gray-500">
              <p className="text-xs font-medium">{DIAGNOSIS_DATA.referral.hospital}</p>
              <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-400 font-bold ml-1">{DIAGNOSIS_DATA.referral.distance}</span>
            </div>
          </div>
          <div className="w-full h-32 bg-gray-100 rounded-xl mb-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-6 -left-2 flex flex-col items-center">
                   <MapPin size={32} className="text-red-500 drop-shadow-md animate-bounce" />
                   <div className="w-4 h-1 bg-black/10 rounded-full blur-[1px]" />
                </div>
                <div className="grid grid-cols-4 grid-rows-4 gap-2 opacity-30">
                  {[...Array(16)].map((_, i) => <div key={i} className="w-8 h-8 bg-white rounded-sm" />)}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <button className="w-full py-4 bg-[#4A90E2] text-white rounded-[8px] font-bold shadow-lg shadow-blue-200 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
              <Calendar size={18} /> Book Appointment
            </button>
            <button className="w-full py-4 bg-white text-[#4A90E2] border-2 border-[#4A90E2] rounded-[8px] font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              <Navigation size={18} /> Open in Maps
            </button>
          </div>
        </FadeInCard>

        <div className="text-center py-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-10 leading-loose">
            Disclaimer: This is an AI-powered assessment. Please consult with a board-certified dermatologist for a clinical diagnosis.
          </p>
        </div>
      </main>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#4A90E2] text-white rounded-full shadow-2xl flex items-center justify-center z-20 border-4 border-white"
      >
        <Search size={24} />
      </motion.button>
    </div>
  );
}