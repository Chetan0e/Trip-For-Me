import React, { useState, useEffect } from 'react';
import { TripPlan, FlightOption, HotelOption, TransitOption } from '../types';
import { MapPin, Calendar, DollarSign, ExternalLink, Clock, ShieldCheck, ArrowRight, Plane, Hotel, Star, Info, BedDouble, Utensils, Ticket, Heart, Train, Bus, Car, Bike, Footprints, Ship } from 'lucide-react';
import BudgetChart from './BudgetChart';

interface TripResultProps {
  plan: TripPlan;
  onReset: () => void;
  onSave?: () => void;
}

const TripResult: React.FC<TripResultProps> = ({ plan, onReset, onSave }) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'plan' | 'finance'>('shop');

  // Determine available tabs based on data
  const hasFlights = plan.suggestedFlights && plan.suggestedFlights.length > 0;
  const hasHotels = plan.suggestedHotels && plan.suggestedHotels.length > 0;
  const hasTransit = plan.transitOptions && plan.transitOptions.length > 0;
  const hasItinerary = plan.itinerary && plan.itinerary.length > 0;
  const hasBudget = plan.budget && plan.budget.total > 0;

  useEffect(() => {
      // Auto-switch tabs if the default 'shop' is empty
      if (!hasFlights && !hasHotels && !hasTransit && hasItinerary) {
          setActiveTab('plan');
      }
  }, [hasFlights, hasHotels, hasTransit, hasItinerary]);

  const formatPrice = (price: string) => {
     return price.includes('$') || price.includes('€') || price.includes('₹') ? price : `${plan.budget.currency} ${price}`;
  };

  const getTransportIcon = (mode: string) => {
      switch(mode.toLowerCase()) {
          case 'flight': return <Plane size={20} className="text-blue-500" />;
          case 'train': return <Train size={20} className="text-orange-500" />;
          case 'bus': return <Bus size={20} className="text-red-500" />;
          case 'car': return <Car size={20} className="text-green-500" />;
          case 'bike': return <Bike size={20} className="text-purple-500" />;
          case 'walk': return <Footprints size={20} className="text-brown-500" />;
          case 'ferry': return <Ship size={20} className="text-cyan-500" />;
          default: return <Plane size={20} className="text-gray-500" />;
      }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 pb-20 animate-fade-in-up">
      
      {/* Summary Header */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
             <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest mb-1">
                <MapPin size={14} /> Trip Generated
             </div>
             <h2 className="text-4xl font-black text-slate-900 font-display">
                {plan.itinerary.length > 0 ? `Trip to ${plan.itinerary[0]?.activities[0]?.location.split(',').pop()?.trim() || "Destination"}` : plan.summary}
             </h2>
             <p className="text-slate-600 mt-1 flex items-center gap-4 font-bold">
                {plan.itinerary.length > 0 && <span className="flex items-center gap-1"><Calendar size={16} className="text-slate-400" /> {plan.itinerary.length} Days</span>}
                {hasBudget && <span className="flex items-center gap-1"><DollarSign size={16} className="text-slate-400" /> Est. {plan.budget.total} {plan.budget.currency}</span>}
             </p>
         </div>
         <div className="flex gap-3">
             <button onClick={onReset} className="px-5 py-2.5 rounded-xl bg-white/50 text-slate-700 font-bold hover:bg-white transition backdrop-blur-sm">
                New Search
             </button>
             {onSave && (
                 <button onClick={onSave} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition flex items-center gap-2 hover:shadow-blue-500/30">
                    <Heart size={18} /> Save Plan
                 </button>
             )}
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
            <div className="glass-panel rounded-2xl shadow-lg p-2 sticky top-24">
                {(hasFlights || hasHotels || hasTransit) && (
                    <NavButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<Ticket size={18} />} label="Transport & Stay" />
                )}
                {hasItinerary && (
                    <NavButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} icon={<Calendar size={18} />} label="Daily Itinerary" />
                )}
                {hasBudget && (
                    <NavButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<DollarSign size={18} />} label="Budget & Costs" />
                )}
            </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-6">
            
            {/* BOOKINGS / TRANSPORT TAB */}
            {activeTab === 'shop' && (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* Routes */}
                    {hasTransit && (
                        <div className="glass-panel rounded-3xl shadow-lg p-6 bg-white/90">
                            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 font-display">
                                <MapPin className="text-purple-500" /> Best Routes
                            </h3>
                            <div className="space-y-4">
                                {plan.transitOptions.map((transit, idx) => (
                                    <div key={idx} className="border border-purple-100 rounded-2xl p-5 hover:border-purple-300 transition flex flex-col sm:flex-row justify-between items-center gap-4 bg-purple-50/50">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-700">
                                                {getTransportIcon(transit.mode)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-lg">{transit.mode} via {transit.provider}</div>
                                                <div className="text-sm text-slate-600 font-medium">{transit.description}</div>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded text-slate-500">{transit.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                            <div className="font-black text-xl text-slate-900">{formatPrice(transit.cost)}</div>
                                            <div className="flex gap-2">
                                                {transit.mapLink && (
                                                    <a href={transit.mapLink} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white border border-gray-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-gray-50 transition">
                                                        MAP
                                                    </a>
                                                )}
                                                {transit.bookingLink && !transit.bookingLink.includes('google.com/maps') && (
                                                    <a href={transit.bookingLink} target="_blank" rel="noreferrer" className="px-5 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-black transition">
                                                        BOOK
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Flights */}
                    {hasFlights && (
                        <div className="glass-panel rounded-3xl shadow-lg p-6 bg-white/90">
                            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 font-display">
                                <Plane className="text-blue-500" /> Flights
                            </h3>
                            <div className="space-y-4">
                                {plan.suggestedFlights.map((flight, idx) => (
                                    <div key={idx} className="border border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                                        <div className="flex items-center gap-4 w-full sm:w-auto">
                                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs">AIR</div>
                                            <div>
                                                <div className="font-bold text-slate-900">{flight.departureTime} - {flight.arrivalTime}</div>
                                                <div className="text-xs text-slate-500 font-bold">{flight.airline} • {flight.duration}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                            <div className="text-right">
                                                <div className="font-black text-lg text-slate-900">{formatPrice(flight.price)}</div>
                                            </div>
                                            <a href={flight.bookingUrl} target="_blank" rel="noreferrer" className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
                                                BOOK
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hotels */}
                    {hasHotels && (
                    <div className="glass-panel rounded-3xl shadow-lg p-6 bg-white/90">
                        <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2 font-display">
                            <Hotel className="text-indigo-500" /> Stays
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {plan.suggestedHotels.map((hotel, idx) => (
                                <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition group bg-white">
                                    <div className="h-32 bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-bold">
                                        {hotel.name}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-slate-900 line-clamp-1">{hotel.name}</h4>
                                            <span className="flex items-center text-xs font-black text-yellow-500">
                                                <Star size={10} fill="currentColor" className="mr-1" /> {hotel.rating}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-4 font-medium">{hotel.location}</p>
                                        <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                            <span className="font-black text-lg text-slate-900">{formatPrice(hotel.pricePerNight)}</span>
                                            <a href={hotel.bookingUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wide">
                                                View Deal <ArrowRight size={12} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>
            )}

            {/* PLAN TAB */}
            {activeTab === 'plan' && hasItinerary && (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-panel bg-blue-50/80 border-blue-100 rounded-2xl p-6">
                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2 font-display">
                             <Info size={18} /> Trip Overview
                        </h4>
                        <p className="text-blue-900/80 text-sm leading-relaxed font-medium">{plan.summary}</p>
                    </div>

                    {plan.itinerary.map((day) => (
                         <div key={day.day} className="glass-panel bg-white/90 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                 <h3 className="font-black text-slate-900 font-display">Day {day.day}: {day.title}</h3>
                                 <span className="text-xs font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 uppercase tracking-wide">{day.theme}</span>
                             </div>
                             <div className="p-6 space-y-8">
                                 {day.activities.map((act, idx) => (
                                     <div key={idx} className="relative pl-8 border-l-2 border-blue-100">
                                         <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></div>
                                         <div className="flex flex-wrap justify-between items-start gap-4">
                                             <div className="flex-1">
                                                 <div className="flex items-center gap-3 mb-1">
                                                     <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{act.time}</span>
                                                     <h4 className="font-bold text-slate-900 text-lg">{act.activity}</h4>
                                                 </div>
                                                 <p className="text-sm text-slate-600 mb-3 font-medium">{act.description}</p>
                                                 
                                                 <div className="flex flex-wrap gap-3">
                                                     <span className="text-xs flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded font-bold">
                                                         <Clock size={12} /> {act.timeSpent}
                                                     </span>
                                                 </div>
                                             </div>
                                             
                                             {act.bookingLink && (
                                                <a href={act.bookingLink} target="_blank" rel="noreferrer" className="flex-shrink-0 px-4 py-2 border border-blue-200 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-50 transition flex items-center gap-1">
                                                    <Ticket size={12} /> TICKET
                                                </a>
                                             )}
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         </div>
                    ))}
                </div>
            )}

            {/* FINANCE TAB */}
            {activeTab === 'finance' && hasBudget && (
                <div className="space-y-6 animate-fade-in">
                    <BudgetChart budget={plan.budget} />
                    
                    <div className="glass-panel bg-white/90 rounded-2xl shadow-lg p-6 border border-slate-100">
                        <h3 className="font-black text-slate-900 mb-6 text-xl font-display">Estimated Costs</h3>
                        <div className="space-y-4">
                            <ExpenseRow label="Transportation" amount={plan.budget.transport} currency={plan.budget.currency} icon={<Plane size={16} className="text-blue-500" />} />
                            <ExpenseRow label="Accommodation" amount={plan.budget.accommodation} currency={plan.budget.currency} icon={<BedDouble size={16} className="text-indigo-500" />} />
                            <ExpenseRow label="Food & Dining" amount={plan.budget.food} currency={plan.budget.currency} icon={<Utensils size={16} className="text-orange-500" />} />
                            <ExpenseRow label="Activities" amount={plan.budget.activities} currency={plan.budget.currency} icon={<Ticket size={16} className="text-green-500" />} />
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-2">
                                <span className="font-black text-slate-900 text-lg">Total</span>
                                <span className="font-black text-2xl text-blue-600">{plan.budget.currency} {plan.budget.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-bold text-sm mb-1 ${
            active 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'text-slate-600 hover:bg-white/50'
        }`}
    >
        {icon}
        {label}
    </button>
);

const ExpenseRow: React.FC<{ label: string; amount: number; currency: string; icon: React.ReactNode }> = ({ label, amount, currency, icon }) => (
    <div className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
            <span className="text-sm font-bold text-slate-700">{label}</span>
        </div>
        <span className="font-mono text-slate-900 font-bold">{currency} {amount}</span>
    </div>
);

export default TripResult;