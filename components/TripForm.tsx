import React, { useState } from 'react';
import { UserPreferences } from '../types';
import CityAutocomplete from './CityAutocomplete';
import { MapPin, Calendar, Users, Briefcase, Loader2, Search, Plane, Hotel, Train, Palmtree, Sparkles, Building2, Ticket, Bus, Car, Bike, Footprints } from 'lucide-react';

interface TripFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const INTERESTS_LIST = [
  "Nature", "History", "Food", "Adventure", "Relaxation", 
  "Nightlife", "Shopping", "Culture", "Spiritual", "Luxury"
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

  // Helper to render distinct form sections
  const renderFormContent = () => {
    // Changed w-full to flex-1 min-w-0 to properly share space with icons
    const commonInputClass = "flex-1 min-w-0 bg-transparent outline-none text-slate-800 font-bold placeholder-slate-400";
    
    switch (activeTab) {
        case 'flight':
            return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 grid grid-cols-2 gap-4">
                         <div className="relative group">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">From</label>
                            <CityAutocomplete 
                                name="origin" 
                                value={formData.origin} 
                                onChange={(val) => handleCityChange('origin', val)}
                                placeholder="Delhi (DEL)"
                                icon={<Plane className="text-blue-500 mr-3" size={20} />}
                            />
                         </div>
                         <div className="relative group">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">To</label>
                            <CityAutocomplete 
                                name="destination" 
                                value={formData.destination} 
                                onChange={(val) => handleCityChange('destination', val)}
                                placeholder="Mumbai (BOM)"
                                icon={<MapPin className="text-blue-500 mr-3" size={20} />}
                            />
                         </div>
                    </div>
                    <div className="md:col-span-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Departure</label>
                            <div className="input-group group focus-within:ring-2 ring-blue-400">
                                <Calendar className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                                <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={`${commonInputClass} text-sm cursor-pointer`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Return</label>
                            <div className="input-group group focus-within:ring-2 ring-blue-400">
                                <Calendar className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                                <input type="date" name="returnDate" value={formData.returnDate} onChange={handleInputChange} className={`${commonInputClass} text-sm cursor-pointer`} />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Class</label>
                         <div className="input-group">
                             <Users className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                             <select name="budget" value={formData.budget} onChange={handleInputChange} className={`${commonInputClass} text-sm cursor-pointer`}>
                                <option value="Budget">Economy</option>
                                <option value="Moderate">Business</option>
                                <option value="Luxury">First Class</option>
                            </select>
                         </div>
                    </div>
                </div>
            );

        case 'hotel':
            return (
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                         <div className="relative group">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Location / Property</label>
                            <CityAutocomplete 
                                name="destination" 
                                value={formData.destination} 
                                onChange={(val) => handleCityChange('destination', val)}
                                placeholder="Goa, Jaipur..."
                                icon={<Building2 className="text-blue-500 mr-3" size={20} />}
                            />
                         </div>
                    </div>
                    <div className="md:col-span-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Check-in</label>
                            <div className="input-group group focus-within:ring-2 ring-blue-400">
                                <Calendar className="text-blue-500 mr-2 flex-shrink-0" size={18} />
                                <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={`${commonInputClass} text-sm cursor-pointer`} />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Nights</label>
                            <div className="input-group">
                                <input required type="number" name="duration" min="1" value={formData.duration} onChange={handleInputChange} className={`${commonInputClass} pl-2`} placeholder="2" />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Guests</label>
                         <div className="input-group">
                             <Users className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                             <input type="number" name="travelers" min="1" value={formData.travelers} onChange={handleInputChange} className={commonInputClass} />
                         </div>
                    </div>
                </div>
            );

        case 'train':
            return (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 grid grid-cols-2 gap-4">
                         <div className="relative group">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">From Station</label>
                            <CityAutocomplete 
                                name="origin" 
                                value={formData.origin} 
                                onChange={(val) => handleCityChange('origin', val)}
                                placeholder="New Delhi"
                                icon={<Train className="text-blue-500 mr-3" size={20} />}
                            />
                         </div>
                         <div className="relative group">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">To Station</label>
                            <CityAutocomplete 
                                name="destination" 
                                value={formData.destination} 
                                onChange={(val) => handleCityChange('destination', val)}
                                placeholder="Varanasi"
                                icon={<MapPin className="text-blue-500 mr-3" size={20} />}
                            />
                         </div>
                    </div>
                    <div className="md:col-span-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Date</label>
                        <div className="input-group group focus-within:ring-2 ring-blue-400">
                            <Calendar className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                            <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={`${commonInputClass} text-sm cursor-pointer`} />
                        </div>
                    </div>
                    <div className="md:col-span-3">
                         <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Class</label>
                         <div className="input-group">
                             <Ticket className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                             <select name="budget" value={formData.budget} onChange={handleInputChange} className={`${commonInputClass} text-sm`}>
                                <option value="Budget">Sleeper (SL)</option>
                                <option value="Moderate">3 AC / 2 AC</option>
                                <option value="Luxury">1st Class AC</option>
                            </select>
                         </div>
                    </div>
                </div>
            );

        case 'trip': 
        case 'package':
        default:
             return (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
                            <div className="relative group">
                                <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">From</label>
                                <CityAutocomplete 
                                    name="origin" 
                                    value={formData.origin} 
                                    onChange={(val) => handleCityChange('origin', val)}
                                    placeholder="Your City"
                                    icon={<MapPin className="text-blue-500 mr-3" size={20} />}
                                />
                            </div>
                            <div className="relative group">
                                <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">To</label>
                                <CityAutocomplete 
                                    name="destination" 
                                    value={formData.destination} 
                                    onChange={(val) => handleCityChange('destination', val)}
                                    placeholder="Dream Destination"
                                    icon={<MapPin className="text-blue-500 mr-3" size={20} />}
                                />
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Date & Duration</label>
                            <div className="input-group group focus-within:ring-2 ring-blue-400">
                                <Calendar className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                                <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={`${commonInputClass} text-sm cursor-pointer`} />
                                <div className="w-px h-6 bg-slate-300 mx-2"></div>
                                <input required type="number" min="1" max="30" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="#" className="bg-transparent outline-none text-slate-800 font-bold w-12 text-center" />
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase mb-1.5 block tracking-wider">Travelers & Budget</label>
                            <div className="input-group">
                                <Users className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                                <input required type="number" min="1" name="travelers" value={formData.travelers} onChange={handleInputChange} className="bg-transparent outline-none text-slate-800 font-bold w-12 mr-2" />
                                <div className="w-px h-6 bg-slate-300 mx-2"></div>
                                <Briefcase className="text-blue-500 mr-3 flex-shrink-0" size={20} />
                                <select name="budget" value={formData.budget} onChange={handleInputChange} className={`${commonInputClass} text-sm cursor-pointer`}>
                                    <option value="Budget">Economy</option>
                                    <option value="Moderate">Standard</option>
                                    <option value="Luxury">Luxury</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {/* Glassy Transport Mode Selector */}
                    <div className="py-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase mb-2 block tracking-wider">Preferred Mode of Travel</label>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { id: 'any', label: 'Best Route', icon: <Sparkles size={14} /> },
                                { id: 'flight', label: 'Flight', icon: <Plane size={14} /> },
                                { id: 'train', label: 'Train', icon: <Train size={14} /> },
                                { id: 'bus', label: 'Bus', icon: <Bus size={14} /> },
                                { id: 'car', label: 'Car', icon: <Car size={14} /> },
                                { id: 'bike', label: 'Bike', icon: <Bike size={14} /> },
                                { id: 'walk', label: 'Walk', icon: <Footprints size={14} /> },
                            ].map(mode => (
                                <button
                                    key={mode.id}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, transportMode: mode.id as any }))}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition border backdrop-blur-sm ${
                                        formData.transportMode === mode.id
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-lg transform scale-105'
                                        : 'bg-white/50 text-slate-600 border-white/40 hover:bg-white/80 hover:border-white'
                                    }`}
                                >
                                    {mode.icon} {mode.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
             );
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up">
      <style>{`
        .input-group {
            display: flex;
            align-items: center;
            border: 1px solid rgba(255,255,255,0.6);
            border-radius: 1rem;
            background-color: rgba(255,255,255,0.7);
            padding: 0.75rem 1rem;
            transition: all 0.3s;
            backdrop-filter: blur(8px);
        }
        .input-group:focus-within {
            border-color: #3b82f6;
            background-color: rgba(255,255,255,0.95);
            box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.15);
            transform: translateY(-1px);
        }
        
        /* STRICTLY FIX CALENDAR PICKER VISIBILITY */
        input[type="date"] {
            cursor: pointer;
            color-scheme: light; /* Forces dark/standard controls regardless of system theme */
        }
        input[type="date"]::-webkit-calendar-picker-indicator {
            cursor: pointer;
            /* Filter to make the icon blue (#3b82f6) */
            filter: invert(43%) sepia(93%) saturate(1394%) hue-rotate(202deg) brightness(98%) contrast(96%);
            opacity: 1; 
            width: 24px;
            height: 24px;
            margin-left: 10px;
            transition: transform 0.2s;
        }
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
            transform: scale(1.2);
            background-color: rgba(59, 130, 246, 0.1);
            border-radius: 50%;
        }
        
        /* Custom scrollbar for dropdown */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
      
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg font-display">
            Explore the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Unseen</span>
        </h1>
        <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
            Next-gen AI travel engine. Lightning fast & personalized.
        </p>
      </div>

      <div className="glass-panel rounded-3xl p-8 shadow-2xl">
        
        {/* Service Type Tabs */}
        <div className="flex gap-4 border-b border-gray-200/50 pb-6 mb-6 overflow-x-auto no-scrollbar">
            {[
                { id: 'trip', icon: <Sparkles size={18} />, label: 'AI Planner' },
                { id: 'flight', icon: <Plane size={18} />, label: 'Flights' },
                { id: 'hotel', icon: <Hotel size={18} />, label: 'Hotels' },
                { id: 'train', icon: <Train size={18} />, label: 'Train/Bus' },
                { id: 'package', icon: <Palmtree size={18} />, label: 'Holidays' },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as any); setFormData(prev => ({...prev, transportMode: 'any'})); }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'bg-white/40 text-slate-700 hover:bg-white/70'
                    }`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {renderFormContent()}

            {/* Filters */}
            {(activeTab === 'trip' || activeTab === 'package') && (
                <div className="flex flex-wrap gap-3 items-center pt-4 border-t border-gray-200/50 mt-2">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Vibe</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {INTERESTS_LIST.slice(0, 6).map(interest => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => handleInterestToggle(interest)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition border ${
                                    formData.interests.includes(interest)
                                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                                    : 'bg-white/40 border-transparent text-slate-600 hover:bg-white/80'
                                }`}
                            >
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-4 bg-slate-900 hover:bg-black text-white font-black text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
            >
                {isLoading ? (
                    <>
                    <Loader2 className="animate-spin" /> Analyzing Routes...
                    </>
                ) : (
                    <>
                    SEARCH {activeTab.toUpperCase()} <Search size={22} className="text-blue-400" />
                    </>
                )}
            </button>
        </form>
      </div>
      
      {/* Trust Badges */}
      <div className="flex justify-center gap-8 text-white/70 text-sm font-bold drop-shadow-sm">
           <span className="flex items-center gap-2"><Plane size={16} className="text-blue-300" /> 400+ Airlines</span>
           <span className="flex items-center gap-2"><Hotel size={16} className="text-blue-300" /> 2M+ Hotels</span>
           <span className="flex items-center gap-2"><Sparkles size={16} className="text-blue-300" /> Gemini Flash AI</span>
      </div>
    </div>
  );
};

export default TripForm;