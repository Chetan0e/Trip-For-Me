import React, { useState } from 'react';
import { UserPreferences } from '../types';
import CityAutocomplete from './CityAutocomplete';
import { 
  MapPin, Calendar, Users, Briefcase, Loader2, Search, Plane, 
  Hotel, Train, Palmtree, Sparkles, Building2, Ticket, Bus, 
  Car, Bike, Footprints, Camera, Music, Coffee, Mountain, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TripFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_LIST = [
  { id: "Nature", icon: <Mountain size={14} /> },
  { id: "History", icon: <Building2 size={14} /> },
  { id: "Food", icon: <Coffee size={14} /> },
  { id: "Adventure", icon: <Compass size={14} /> },
  { id: "Relaxation", icon: <Palmtree size={14} /> },
  { id: "Nightlife", icon: <Music size={14} /> },
  { id: "Culture", icon: <Sparkles size={14} /> },
  { id: "Photography", icon: <Camera size={14} /> },
  { id: "Luxury", icon: <Briefcase size={14} /> },
  { id: "Shopping", icon: <Ticket size={14} /> }
];

const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'trip' | 'flight' | 'hotel' | 'train' | 'package'>('trip');
  
  const [formData, setFormData] = useState<UserPreferences>({
    searchType: 'trip',
    transportMode: 'any',
    origin: '',
    destination: '',
    startDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    duration: 3,
    travelers: 1,
    budget: 'Moderate',
    travelerType: 'Family',
    interests: [],
    image: undefined
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCityChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...formData, searchType: activeTab };
    onSubmit(finalData);
  };

  const commonInputClass = "flex-1 min-w-0 bg-transparent outline-none text-slate-800 font-bold placeholder-slate-400";
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'flight':
        return (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">From</label>
                <CityAutocomplete name="origin" value={formData.origin} onChange={(val) => handleCityChange('origin', val)} placeholder="Departure City" icon={<Plane className="text-blue-500" size={18} />} />
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">To</label>
                <CityAutocomplete name="destination" value={formData.destination} onChange={(val) => handleCityChange('destination', val)} placeholder="Target City" icon={<MapPin className="text-rose-500" size={18} />} />
              </div>
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Departure</label>
                <div className="input-group">
                  <Calendar className="text-blue-500 mr-3" size={18} />
                  <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={commonInputClass} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Return</label>
                <div className="input-group">
                  <Calendar className="text-blue-500 mr-3" size={18} />
                  <input type="date" name="returnDate" value={formData.returnDate} onChange={handleInputChange} className={commonInputClass} />
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Cabin Class</label>
              <div className="input-group">
                <Users className="text-blue-500 mr-3" size={18} />
                <select name="budget" value={formData.budget} onChange={handleInputChange} className={commonInputClass}>
                  <option value="Budget">Economy</option>
                  <option value="Moderate">Business</option>
                  <option value="Luxury">First Class</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 'hotel':
        return (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Location</label>
              <CityAutocomplete name="destination" value={formData.destination} onChange={(val) => handleCityChange('destination', val)} placeholder="Where are you staying?" icon={<Building2 className="text-indigo-500" size={18} />} />
            </div>
            <div className="md:col-span-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Check-in</label>
                <div className="input-group">
                  <Calendar className="text-blue-500 mr-3" size={18} />
                  <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={commonInputClass} />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Guests</label>
                <div className="input-group">
                  <Users className="text-blue-500 mr-3" size={18} />
                  <input type="number" name="travelers" min="1" value={formData.travelers} onChange={handleInputChange} className={commonInputClass} />
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Hotel Star</label>
              <div className="input-group">
                <Sparkles className="text-amber-500 mr-3" size={18} />
                <select name="budget" value={formData.budget} onChange={handleInputChange} className={commonInputClass}>
                  <option value="Budget">3 Star (Budget)</option>
                  <option value="Moderate">4 Star (Moderate)</option>
                  <option value="Luxury">5 Star (Luxury)</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 'train':
        return (
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Origin</label>
                <CityAutocomplete name="origin" value={formData.origin} onChange={(val) => handleCityChange('origin', val)} placeholder="From Station" icon={<Train className="text-blue-600" size={18} />} />
              </div>
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Destination</label>
                <CityAutocomplete name="destination" value={formData.destination} onChange={(val) => handleCityChange('destination', val)} placeholder="To Station" icon={<MapPin className="text-emerald-500" size={18} />} />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Date</label>
              <div className="input-group">
                <Calendar className="text-blue-500 mr-3" size={18} />
                <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={commonInputClass} />
              </div>
            </div>
            <div className="md:col-span-3">
              <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Ticket Class</label>
              <div className="input-group">
                <Ticket className="text-blue-500 mr-3" size={18} />
                <select name="budget" value={formData.budget} onChange={handleInputChange} className={commonInputClass}>
                  <option value="Budget">Sleeper / General</option>
                  <option value="Moderate">AC Chair / 3rd AC</option>
                  <option value="Luxury">2nd AC / 1st AC</option>
                </select>
              </div>
            </div>
          </motion.div>
        );

      case 'trip':
      case 'package':
      default:
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Origin</label>
                  <CityAutocomplete name="origin" value={formData.origin} onChange={(val) => handleCityChange('origin', val)} placeholder="Current Location" icon={<MapPin className="text-blue-500" size={18} />} />
                </div>
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Destination</label>
                  <CityAutocomplete name="destination" value={formData.destination} onChange={(val) => handleCityChange('destination', val)} placeholder="Where to go?" icon={<Sparkles className="text-amber-500" size={18} />} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Departure & Days</label>
                <div className="input-group">
                  <Calendar className="text-blue-500 mr-3" size={18} />
                  <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={commonInputClass} />
                  <div className="w-px h-6 bg-slate-200 mx-3"></div>
                  <input required type="number" min="1" max="30" name="duration" value={formData.duration} onChange={handleInputChange} className="w-10 bg-transparent font-black text-slate-800 outline-none text-center" />
                  <span className="text-[10px] font-bold text-slate-400 ml-1">DAYS</span>
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Travelers</label>
                <div className="input-group">
                  <Users className="text-blue-500 mr-3" size={18} />
                  <input required type="number" min="1" name="travelers" value={formData.travelers} onChange={handleInputChange} className={commonInputClass} />
                  <span className="text-[10px] font-bold text-slate-400">PEOPLE</span>
                </div>
              </div>

              <div className="md:col-span-4">
                <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-widest">Budget Level</label>
                <div className="input-group">
                  <Briefcase className="text-blue-500 mr-3" size={18} />
                  <select name="budget" value={formData.budget} onChange={handleInputChange} className={commonInputClass}>
                    <option value="Budget">Economy (₹)</option>
                    <option value="Moderate">Comfort (₹₹)</option>
                    <option value="Luxury">Premium (₹₹₹)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-black text-slate-500 uppercase mb-3 block tracking-widest">Preferred Transport</label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { id: 'any', label: 'AI Choice', icon: <Sparkles size={14} /> },
                  { id: 'flight', label: 'Fastest', icon: <Plane size={14} /> },
                  { id: 'train', label: 'Scenic', icon: <Train size={14} /> },
                  { id: 'car', label: 'Road Trip', icon: <Car size={14} /> },
                  { id: 'bus', label: 'Bus', icon: <Bus size={14} /> },
                ].map(mode => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, transportMode: mode.id as any }))}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${
                      formData.transportMode === mode.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                      : 'bg-white text-slate-600 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    {mode.icon} {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12 py-10">
      <style>{`
        .input-group {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          border-radius: 1.25rem;
          padding: 0.875rem 1.25rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-group:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 10px 30px -10px rgba(59, 130, 246, 0.2);
          transform: translateY(-2px);
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
      
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-white tracking-tighter font-display drop-shadow-2xl"
        >
          Journey <span className="text-blue-400">Beyond</span>.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-blue-100 font-medium max-w-xl mx-auto opacity-80"
        >
          Supercharged with Gemini AI for the ultimate travel experience.
        </motion.p>
      </div>

      <div className="bg-white/95 backdrop-blur-3xl rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20">
        <div className="flex gap-4 border-b border-slate-100 pb-8 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'trip', icon: <Sparkles size={18} />, label: 'AI Planner' },
            { id: 'flight', icon: <Plane size={18} />, label: 'Flights' },
            { id: 'hotel', icon: <Hotel size={18} />, label: 'Hotels' },
            { id: 'train', icon: <Train size={18} />, label: 'Rail/Road' },
            { id: 'package', icon: <Palmtree size={18} />, label: 'Explore' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setFormData(prev => ({ ...prev, transportMode: 'any' })); }}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-black transition-all ${
                activeTab === tab.id 
                ? 'bg-slate-950 text-white shadow-xl scale-105' 
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <AnimatePresence mode="wait">
            {renderTabContent()}
          </AnimatePresence>

          {(activeTab === 'trip' || activeTab === 'package') && (
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Travel Interests</label>
              <div className="flex flex-wrap gap-2">
                {INTERESTS_LIST.map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInterestToggle(interest.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all border ${
                      formData.interests.includes(interest.id)
                      ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                      : 'bg-white border-slate-100 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {interest.icon} {interest.id}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                GENERATE MY {activeTab.toUpperCase()} <Search size={24} className="group-hover:translate-x-1 transition" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-10 text-white/40 text-xs font-black uppercase tracking-[0.2em]">
        <span className="flex items-center gap-2"><Plane size={14} /> 500+ Ecosystem Partners</span>
        <span className="flex items-center gap-2"><Briefcase size={14} /> Smart Budgeting</span>
        <span className="flex items-center gap-2"><Sparkles size={14} /> Gemini Flash Engine</span>
      </div>
    </div>
  );
};

export default TripForm;