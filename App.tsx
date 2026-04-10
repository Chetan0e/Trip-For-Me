import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, googleProvider, db } from './services/firebase';
import TripForm from './components/TripForm';
import TripResult from './components/TripResult';
import { generateTripPlan } from './services/geminiService';
import { UserPreferences, TripPlan, ViewState, UserProfile } from './types';
import { AlertCircle, User, X, Plane, LogOut, Heart, Map, Menu, Loader2, Luggage } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.FORM);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Fetch user trips from Firestore
        const q = query(
          collection(db, "trips"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const unsubscribeTrips = onSnapshot(q, (snapshot) => {
          const trips = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as TripPlan[];

          setUserProfile({
            uid: user.uid,
            name: user.displayName || 'Traveler',
            email: user.email || '',
            photoURL: user.photoURL || '',
            trips: trips
          });
        });

        setLoading(false);
        return () => unsubscribeTrips();
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginOpen(false);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setViewState(ViewState.FORM);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleSaveTrip = async () => {
    if (!userProfile) {
      setIsLoginOpen(true);
      return;
    }
    if (!tripPlan) return;

    try {
      const tripData = {
        ...tripPlan,
        userId: userProfile.uid,
        createdAt: Date.now(),
        serverTimestamp: serverTimestamp()
      };
      await addDoc(collection(db, "trips"), tripData);
      alert('Trip saved to your profile!');
    } catch (error) {
      console.error("Error saving trip:", error);
      alert('Failed to save trip. Please check your Firestore permissions.');
    }
  };

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setViewState(ViewState.LOADING);
    setErrorMsg(null);
    try {
      const plan = await generateTripPlan(prefs);
      setTripPlan(plan);
      setViewState(ViewState.RESULT);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Something went wrong while generating your trip.");
      setViewState(ViewState.ERROR);
    }
  };

  const handleReset = () => {
    setTripPlan(null);
    setViewState(ViewState.FORM);
    setErrorMsg(null);
  };

  const renderProfile = () => {
    if (!userProfile) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-6xl"
      >
        <div className="glass-panel rounded-[32px] p-8 shadow-2xl mb-8 border border-white/40">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <img src={userProfile.photoURL} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-blue-500 p-0.5" />
              <div>
                <h2 className="text-3xl font-bold font-display text-slate-900 leading-tight">{userProfile.name}</h2>
                <p className="text-slate-600 font-medium">{userProfile.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition flex items-center gap-2 border border-red-100">
              <LogOut size={18} /> Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-1 font-display">{userProfile.trips.length}</div>
              <div className="text-slate-700 font-bold text-sm uppercase tracking-wider">Saved Trips</div>
            </div>
            <div className="bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm">
              <div className="text-3xl font-bold text-indigo-600 mb-1 font-display">0</div>
              <div className="text-slate-700 font-bold text-sm uppercase tracking-wider">Bookings</div>
            </div>
            <div className="bg-white/60 p-6 rounded-2xl border border-white/50 shadow-sm">
              <div className="text-3xl font-bold text-emerald-600 mb-1 font-display">Elite</div>
              <div className="text-slate-700 font-bold text-sm uppercase tracking-wider">Membership</div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 font-display drop-shadow-md">
          <Heart className="text-red-500 fill-red-500" /> My Saved Journeys
        </h3>

        {userProfile.trips.length === 0 ? (
          <div className="text-center py-20 glass-panel-dark rounded-[40px] border border-white/10">
            <Map className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/70 text-lg font-medium">No trips saved yet. Your next adventure awaits!</p>
            <button onClick={handleReset} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold transition shadow-xl">Plan a Trip Now</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
            {userProfile.trips.map((trip) => (
              <motion.div 
                key={trip.id} 
                whileHover={{ y: -8 }}
                className="glass-panel rounded-3xl overflow-hidden shadow-lg transition-all border-0 cursor-pointer group" 
                onClick={() => { setTripPlan(trip); setViewState(ViewState.RESULT); }}
              >
                <div className="h-48 bg-slate-200 relative overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1000&auto=format&fit=crop`} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    alt={trip.destinationInfo}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="font-bold text-xl font-display line-clamp-1">{trip.destinationInfo.split(',')[0]}</div>
                    <div className="text-xs text-white/70">{new Date(trip.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full">{trip.budget.currency} {trip.budget.total.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium line-clamp-2 leading-relaxed">{trip.summary}</p>
                  <div className="mt-4 flex items-center gap-2 text-blue-600 font-bold text-sm">
                    Open Plan <Plane size={14} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="border-b border-white/5 px-6 py-4 sticky top-0 z-50 backdrop-blur-2xl bg-black/40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={handleReset} className="cursor-pointer flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:rotate-6">
              <Luggage size={22} className="text-white" />
            </div>
            <h1 className="font-display font-black text-2xl tracking-tighter text-white leading-none">Trip<span className="text-blue-400">For</span>Me</h1>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={handleReset} className="hidden md:block text-white/70 hover:text-white transition font-bold text-xs uppercase tracking-widest">Plan Trip</button>
            
            {userProfile ? (
              <button 
                onClick={() => setViewState(ViewState.PROFILE)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-2xl transition-all border border-white/10"
              >
                <img src={userProfile.photoURL} alt="User" className="w-7 h-7 rounded-full shadow-inner" />
                <span className="font-bold text-sm hidden sm:inline">{userProfile.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-white text-slate-900 px-7 py-2.5 rounded-full transition-all font-black text-sm shadow-xl hover:shadow-white/10 hover:scale-105 active:scale-95"
              >
                Login
              </button>
            )}
            
            <button className="md:hidden text-white/50 hover:text-white transition">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-start flex-grow z-10">
        <AnimatePresence mode="wait">
          {viewState === ViewState.FORM && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full mt-4 md:mt-8"
            >
              <TripForm onSubmit={handleFormSubmit} isLoading={false} />
            </motion.div>
          )}

          {viewState === ViewState.LOADING && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-10 py-32"
            >
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-[40px] animate-pulse"></div>
                <div className="absolute inset-0 border-[6px] border-white/10 rounded-full"></div>
                <div className="absolute inset-0 border-[6px] border-blue-500 border-t-transparent rounded-full animate-spin-slow"></div>
                <Plane className="absolute inset-0 m-auto text-white animate-bounce-slow" size={40} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black font-display text-white tracking-tight drop-shadow-2xl">Crafting Perfection...</h2>
                <p className="text-blue-200/80 text-xl font-medium max-w-md mx-auto">Our AI is negotiating with airlines and hotels to find your dream escape.</p>
              </div>
            </motion.div>
          )}

          {viewState === ViewState.RESULT && tripPlan && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <TripResult plan={tripPlan} onReset={handleReset} onSave={handleSaveTrip} />
            </motion.div>
          )}

          {viewState === ViewState.PROFILE && renderProfile()}

          {viewState === ViewState.ERROR && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-10 rounded-[3rem] shadow-2xl text-center max-w-lg border-t-[8px] border-red-500/50"
            >
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Generation Interrupted</h3>
              <p className="text-slate-600 mb-8 leading-relaxed font-semibold text-lg">{errorMsg}</p>
              <button 
                onClick={handleReset}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-black/20"
              >
                Retry Request
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-12 mt-auto backdrop-blur-3xl bg-black/60 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-50">
            <Luggage size={18} className="text-white" />
            <span className="font-display font-black text-white tracking-tighter">Trip<span className="text-blue-400">For</span>Me</span>
          </div>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
            &copy; 2026 Crafted with Passion for Global Explorers
          </p>
          <div className="flex gap-6">
            <Heart size={18} className="text-red-500/50 animate-pulse" />
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLoginOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] p-10 w-full max-w-md relative shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-all p-1 hover:bg-slate-100 rounded-full">
                <X size={20} />
              </button>
              
              <div className="text-center mb-10">
                <div className="inline-block p-4 bg-blue-50 rounded-3xl mb-4">
                  <User className="text-blue-600" size={32} />
                </div>
                <h2 className="text-3xl font-black font-display text-slate-900 mb-2 tracking-tight">Access Your World</h2>
                <p className="text-slate-500 font-medium">Join 50,000+ travelers planning with AI</p>
              </div>

              <div className="space-y-6">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-white border-2 border-slate-100 text-slate-700 font-black py-4 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:border-blue-100 flex items-center justify-center gap-4 group"
                >
                  {isLoggingIn ? <Loader2 className="animate-spin text-blue-600" /> : (
                    <>
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6 group-hover:scale-110 transition" />
                      Continue with Google
                    </>
                  )}
                </button>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink-0 mx-6 text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">Secure Gateway</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <p className="text-slate-400 text-[11px] leading-relaxed font-bold uppercase tracking-wider text-center">
                    By continuing, you agree to our <span className="text-blue-600 cursor-pointer">Terms of Service</span> and <span className="text-blue-600 cursor-pointer">Privacy Policy</span>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;