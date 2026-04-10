import React, { useState, useEffect } from 'react';
import { TripPlan, FlightOption, HotelOption, TransitOption } from '../types';
import { 
  MapPin, Calendar, DollarSign, ExternalLink, Clock, ShieldCheck, 
  ArrowRight, Plane, Hotel, Star, Info, BedDouble, Utensils, 
  Ticket, Heart, Train, Bus, Car, Bike, Footprints, Ship, 
  Download, Share2, Sparkles, Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BudgetChart from './BudgetChart';

interface TripResultProps {
  plan: TripPlan;
  onReset: () => void;
  onSave?: () => void;
}

const TripResult: React.FC<TripResultProps> = ({ plan, onReset, onSave }) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'plan' | 'finance'>('shop');

  const hasBookingData = (plan.suggestedFlights?.length || 0) + 
                       (plan.suggestedHotels?.length || 0) + 
                       (plan.transitOptions?.length || 0) > 0;
  
  const hasItinerary = plan.itinerary?.length > 0;
  const hasBudget = plan.budget?.total > 0;

  useEffect(() => {
    if (!hasBookingData && hasItinerary) {
      setActiveTab('plan');
    }
  }, [hasBookingData, hasItinerary]);

  const formatPrice = (price: string | number) => {
    const val = typeof price === 'string' ? price : price.toLocaleString();
    return val.includes('$') || val.includes('₹') ? val : `${plan.budget.currency} ${val}`;
  };

  const getTransportIcon = (mode: string) => {
    switch(mode.toLowerCase()) {
      case 'flight': return <Plane size={20} className="text-blue-500" />;
      case 'train': return <Train size={20} className="text-orange-500" />;
      case 'bus': return <Bus size={20} className="text-red-500" />;
      case 'car': return <Car size={20} className="text-green-500" />;
      case 'bike': return <Bike size={20} className="text-purple-500" />;
      case 'walk': return <Footprints size={20} className="text-orange-700" />;
      case 'ferry': return <Ship size={20} className="text-cyan-500" />;
      default: return <Navigation size={20} className="text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-32">
      {/* Dynamic Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[40px] opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="glass-panel rounded-[40px] p-8 md:p-12 shadow-2xl border-white/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 backdrop-blur-3xl relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200">
                AI Intelligence Ready
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure Travel Plan
              </span>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 font-display tracking-tight leading-tight">
                {plan.itinerary[0]?.activities[0]?.location.split(',')[0] || plan.destinationInfo.split(',')[0]} Discovery
              </h2>
              <div className="flex flex-wrap items-center gap-6 mt-4 text-slate-600 font-bold">
                <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl">
                  <Calendar size={18} className="text-blue-500" /> {plan.itinerary.length} Days
                </span>
                <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl">
                  <DollarSign size={18} className="text-emerald-500" /> {formatPrice(plan.budget.total)}
                </span>
                <span className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-2xl">
                  <MapPin size={18} className="text-rose-500" /> {plan.destinationInfo.split(',').slice(-1)[0]}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button onClick={onReset} className="flex-1 px-8 py-4 rounded-3xl bg-white border border-slate-200 text-slate-900 font-black hover:bg-slate-50 transition shadow-sm hover:shadow-md">
              New Escape
            </button>
            {onSave && (
              <button onClick={onSave} className="flex-1 px-8 py-4 bg-blue-600 text-white rounded-3xl font-black shadow-xl hover:bg-blue-700 transition flex items-center justify-center gap-3 hover:-translate-y-1 transform">
                <Heart size={20} className="fill-white/20" /> Keep This Plan
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-4">
            <div className="p-2 bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl flex flex-col gap-1">
              {hasBookingData && (
                <MenuButton active={activeTab === 'shop'} onClick={() => setActiveTab('shop')} icon={<Navigation size={20} />} label="Travel & Stay" />
              )}
              {hasItinerary && (
                <MenuButton active={activeTab === 'plan'} onClick={() => setActiveTab('plan')} icon={<Calendar size={20} />} label="Daily Journey" />
              )}
              {hasBudget && (
                <MenuButton active={activeTab === 'finance'} onClick={() => setActiveTab('finance')} icon={<DollarSign size={20} />} label="Smart Budget" />
              )}
            </div>
            
            <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
              <Sparkles className="absolute -right-4 -top-4 w-24 h-24 opacity-10 group-hover:scale-125 transition duration-700" />
              <h4 className="font-display font-black text-lg mb-2 relative z-10">AI Pro Tip</h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">
                {plan.safetyTips?.[0] || "Book at least 3 weeks in advance to save up to 25% on these specific routes."}
              </p>
              <button className="mt-4 text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-2 hover:text-blue-300 transition">
                Analyze More <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {activeTab === 'shop' && (
              <motion.div key="shop" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                {plan.transitOptions?.length > 0 && (
                  <ContentSection icon={<Navigation className="text-purple-500" />} title="Optimized Transit">
                    <div className="grid gap-4">
                      {plan.transitOptions.map((transit, idx) => (
                        <BookingCard 
                          key={idx}
                          icon={getTransportIcon(transit.mode)}
                          title={`${transit.mode} • ${transit.provider}`}
                          subtitle={transit.description}
                          tag={transit.duration}
                          price={transit.cost}
                          links={[
                            { label: "Book", href: transit.bookingLink, primary: true },
                            { label: "Explore Map", href: transit.mapLink }
                          ]}
                          currency={plan.budget.currency}
                        />
                      ))}
                    </div>
                  </ContentSection>
                )}

                {plan.suggestedFlights?.length > 0 && (
                  <ContentSection icon={<Plane className="text-blue-500" />} title="Aerial Routes">
                    <div className="grid gap-4">
                      {plan.suggestedFlights.map((flight, idx) => (
                        <BookingCard 
                          key={idx}
                          icon={<div className="font-black text-[10px] opacity-40">FLT</div>}
                          title={`${flight.airline} (${flight.departureTime} → ${flight.arrivalTime})`}
                          subtitle={`Estimated flight time: ${flight.duration}`}
                          tag="Best Deal"
                          price={flight.price}
                          links={[{ label: "Reserve Flight", href: flight.bookingUrl, primary: true }]}
                          currency={plan.budget.currency}
                        />
                      ))}
                    </div>
                  </ContentSection>
                )}

                {plan.suggestedHotels?.length > 0 && (
                  <ContentSection icon={<Hotel className="text-indigo-500" />} title="Curated Stays">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {plan.suggestedHotels.map((hotel, idx) => (
                        <div key={idx} className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-lg group hover:shadow-2xl transition duration-500">
                          <div className="h-48 bg-slate-100 relative">
                             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                <Star size={12} className="text-amber-500 fill-amber-500" />
                                <span className="text-[10px] font-black text-slate-900">{hotel.rating}</span>
                             </div>
                             <div className="flex items-center justify-center h-full text-slate-300 font-display font-black text-2xl uppercase opacity-20 group-hover:scale-110 transition duration-700">The Stay</div>
                          </div>
                          <div className="p-8">
                             <div className="flex flex-wrap gap-2 mb-3">
                                {hotel.features?.slice(0, 3).map(f => <span key={f} className="text-[9px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{f}</span>)}
                             </div>
                             <h4 className="text-xl font-bold text-slate-900 mb-2">{hotel.name}</h4>
                             <p className="text-xs text-slate-500 font-bold mb-6 flex items-center gap-1.5"><MapPin size={12} /> {hotel.location}</p>
                             <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                <div>
                                   <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Nightly Rate</div>
                                   <div className="text-2xl font-black text-slate-950">{formatPrice(hotel.pricePerNight)}</div>
                                </div>
                                <a href={hotel.bookingUrl} target="_blank" rel="noreferrer" className="p-4 bg-slate-950 text-white rounded-2xl hover:bg-blue-600 transition shadow-xl">
                                   <ExternalLink size={20} />
                                </a>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ContentSection>
                )}
              </motion.div>
            )}

            {activeTab === 'plan' && (
              <motion.div key="plan" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 pb-20">
                <div className="p-8 bg-blue-600 rounded-[32px] text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <Sparkles className="mb-4 text-blue-200" size={32} />
                    <h4 className="text-2xl font-black font-display mb-3">The Narrative</h4>
                    <p className="text-blue-50 text-sm font-semibold leading-relaxed opacity-90">{plan.summary}</p>
                </div>

                <div className="space-y-12 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-200 before:rounded-full">
                  {plan.itinerary.map((day, dIdx) => (
                    <div key={day.day} className="relative pl-12">
                      <div className="absolute left-0 top-0 w-9 h-9 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center font-black text-sm z-10 shadow-lg">
                        {day.day}
                      </div>
                      <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <h3 className="text-2xl font-black text-slate-900 font-display">Day {day.day}: {day.title}</h3>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{day.theme}</span>
                          </div>
                          <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                            {day.activities.length} Explorations
                          </span>
                        </div>

                        <div className="grid gap-4">
                          {day.activities.map((act, aIdx) => (
                            <div key={aIdx} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                              <div className="flex flex-col sm:flex-row justify-between gap-6">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">{act.time}</span>
                                    <h5 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition">{act.activity}</h5>
                                  </div>
                                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{act.description}</p>
                                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-400" /> {act.timeSpent}</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-rose-400" /> {act.location}</span>
                                    {act.costEstimate && <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-emerald-400" /> Est. {act.costEstimate}</span>}
                                  </div>
                                </div>
                                {act.bookingLink && (
                                  <a href={act.bookingLink} target="_blank" rel="noreferrer" className="flex-shrink-0 self-start sm:self-center px-6 py-3 bg-slate-50 text-slate-900 text-xs font-black rounded-2xl hover:bg-slate-900 hover:text-white transition flex items-center gap-2">
                                    TICKET <ExternalLink size={14} />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'finance' && (
              <motion.div key="finance" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <BudgetChart budget={plan.budget} />
                  <div className="bg-white/90 backdrop-blur-3xl rounded-[40px] p-10 shadow-2xl border border-white/50 flex flex-col justify-center">
                    <h3 className="text-3xl font-black text-slate-900 font-display mb-2">Total Exposure</h3>
                    <div className="text-6xl font-black text-blue-600 tracking-tighter mb-4">
                      {plan.budget.currency} {formatPrice(plan.budget.total)}
                    </div>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8">
                      This calculation includes confirmed bookings, suggested local activities, and a 15% safety buffer for miscellaneous expenses.
                    </p>
                    <div className="space-y-2">
                       <button className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-600 transition">
                          <Download size={18} /> Download Expense Ledger
                       </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <ExpenseGridItem icon={<Plane />} label="Transport" amount={plan.budget.transport} currency={plan.budget.currency} color="bg-blue-500" />
                  <ExpenseGridItem icon={<Hotel />} label="Stay" amount={plan.budget.accommodation} currency={plan.budget.currency} color="bg-indigo-500" />
                  <ExpenseGridItem icon={<Utensils />} label="Food" amount={plan.budget.food} currency={plan.budget.currency} color="bg-rose-500" />
                  <ExpenseGridItem icon={<Ticket />} label="Activities" amount={plan.budget.activities} currency={plan.budget.currency} color="bg-emerald-500" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const MenuButton = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-black text-xs uppercase tracking-widest ${active ? 'bg-slate-950 text-white shadow-xl translate-x-1' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}>
    {icon} {label}
  </button>
);

const ContentSection = ({ icon, title, children }: any) => (
  <div className="space-y-6">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">{icon}</div>
      <h3 className="text-2xl font-black text-slate-900 font-display">{title}</h3>
    </div>
    {children}
  </div>
);

const BookingCard = ({ icon, title, subtitle, tag, price, links, currency }: any) => {
  const formatVal = (v: string | number) => {
    const s = typeof v === 'string' ? v : v.toLocaleString();
    return s.includes('₹') || s.includes('$') ? s : `${currency} ${s}`;
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:scale-[1.01] transition duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-center gap-6 w-full">
        <div className="w-16 h-16 rounded-[20px] bg-slate-50 flex items-center justify-center text-slate-400 shadow-inner">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-black text-slate-900 text-lg leading-tight">{title}</h4>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[9px] font-black uppercase tracking-widest">{tag}</span>
          </div>
          <p className="text-xs text-slate-500 font-bold line-clamp-1">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-0 border-slate-50">
        <div className="text-2xl font-black text-slate-950">{formatVal(price)}</div>
        <div className="flex gap-2">
          {links.map((l: any, i: number) => (
            <a key={i} href={l.href} target="_blank" rel="noreferrer" className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-sm hover:shadow-lg ${l.primary ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExpenseGridItem = ({ icon, label, amount, currency, color }: any) => (
  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 text-center space-y-4">
    <div className={`w-14 h-14 mx-auto rounded-3xl ${color} text-white flex items-center justify-center shadow-lg shadow-${color.split('-')[1]}-500/20`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</h5>
      <div className="text-xl font-black text-slate-900">{currency} {amount.toLocaleString()}</div>
    </div>
  </div>
);

export default TripResult;