import React, { useState, useEffect } from 'react';
import TripForm from './components/TripForm';
import TripResult from './components/TripResult';
import { generateTripPlan } from './services/geminiService';
import { UserPreferences, TripPlan, ViewState, UserProfile } from './types';
import { AlertCircle, User, X, Plane, LogOut, Heart, Map, Menu, Loader2, Luggage } from 'lucide-react';

function App() {
  const [viewState, setViewState] = useState<ViewState>(ViewState.FORM);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Simulate Backend: Check LocalStorage for session
    const savedUser = localStorage.getItem('tripforme_user');
    if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
    }
  }, []);

  const handleGoogleLogin = () => {
    setIsLoggingIn(true);
    // Simulate API call delay
    setTimeout(() => {
        const newUser: UserProfile = {
            name: 'Google User',
            email: 'user@gmail.com',
            phone: '',
            isLoggedIn: true,
            trips: userProfile?.trips || [] 
        };
        setUserProfile(newUser);
        // Simulate Backend: Save session to LocalStorage
        localStorage.setItem('tripforme_user', JSON.stringify(newUser));
        setIsLoggingIn(false);
        setIsLoginOpen(false);
    }, 1500);
  };

  const handleLogout = () => {
      setUserProfile(null);
      // Simulate Backend: Clear session
      localStorage.removeItem('tripforme_user');
      setViewState(ViewState.FORM);
  };

  const handleSaveTrip = () => {
      if (!userProfile) {
          setIsLoginOpen(true);
          return;
      }
      if (!tripPlan) return;

      const updatedUser = {
          ...userProfile,
          trips: [tripPlan, ...userProfile.trips]
      };
      setUserProfile(updatedUser);
      // Simulate Backend: Update user record
      localStorage.setItem('tripforme_user', JSON.stringify(updatedUser));
      alert('Trip saved to your profile!');
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
          <div className="w-full max-w-6xl animate-fade-in-up">
              <div className="glass-panel rounded-[32px] p-8 shadow-2xl mb-8 border border-white/40">
                  <div className="flex justify-between items-center mb-6">
                      <div>
                          <h2 className="text-3xl font-bold font-display text-slate-900">My Profile</h2>
                          <p className="text-slate-600">Welcome back, {userProfile.name}</p>
                      </div>
                      <button onClick={handleLogout} className="text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition flex items-center gap-2">
                          <LogOut size={18} /> Logout
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white/60 p-6 rounded-2xl border border-white/50">
                          <div className="text-3xl font-bold text-blue-600 mb-1 font-display">{userProfile.trips.length}</div>
                          <div className="text-slate-700 font-bold text-sm uppercase tracking-wider">Saved Trips</div>
                      </div>
                      <div className="bg-white/60 p-6 rounded-2xl border border-white/50">
                          <div className="text-3xl font-bold text-indigo-600 mb-1 font-display">0</div>
                          <div className="text-slate-700 font-bold text-sm uppercase tracking-wider">Upcoming Bookings</div>
                      </div>
                      <div className="bg-white/60 p-6 rounded-2xl border border-white/50">
                          <div className="text-3xl font-bold text-green-600 mb-1 font-display">₹ 0</div>
                          <div className="text-slate-700 font-bold text-sm uppercase tracking-wider">Trip For Me Cash</div>
                      </div>
                  </div>
              </div>

              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 font-display drop-shadow-md">
                  <Heart className="text-red-500 fill-red-500" /> Saved Itineraries
              </h3>

              {userProfile.trips.length === 0 ? (
                  <div className="text-center py-12 glass-panel-dark rounded-3xl border border-white/10">
                      <Map className="w-16 h-16 text-white/50 mx-auto mb-4" />
                      <p className="text-white/70 text-lg">No trips saved yet. Start planning!</p>
                      <button onClick={handleReset} className="mt-4 text-blue-300 font-bold hover:text-white transition uppercase tracking-wide text-sm">Plan a Trip</button>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProfile.trips.map((trip) => (
                          <div key={trip.id} className="glass-panel rounded-2xl overflow-hidden hover:shadow-2xl transition group cursor-pointer border-0" onClick={() => { setTripPlan(trip); setViewState(ViewState.RESULT); }}>
                              <div className="h-40 bg-slate-200 relative">
                                  <img 
                                    src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" 
                                    className="w-full h-full object-cover"
                                    alt="Trip Cover"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                  <div className="absolute bottom-4 left-4 text-white">
                                      <div className="font-bold text-xl font-display">{trip.destinationInfo.split(',')[0] || "Trip"}</div>
                                      <div className="text-xs text-white/80">{new Date(trip.createdAt).toLocaleDateString()}</div>
                                  </div>
                              </div>
                              <div className="p-4">
                                  <div className="flex justify-between items-center mb-2">
                                      <span className="text-xs font-bold text-slate-800 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">{trip.budget.currency} {trip.budget.total}</span>
                                  </div>
                                  <p className="text-sm text-slate-800 font-medium line-clamp-2">{trip.summary}</p>
                                  <div className="mt-4 text-blue-700 font-bold text-sm group-hover:underline">View Itinerary →</div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
      );
  };

  return (
    // The main background is set on the body in index.html. We use min-h-screen here.
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Glass Navbar */}
      <nav className="border-b border-white/10 px-6 py-4 sticky top-0 z-50 backdrop-blur-xl bg-black/30">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
              {/* LOGO */}
              <div 
                  onClick={handleReset}
                  className="cursor-pointer flex items-center gap-3 group"
              >
                  <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition">
                      <Luggage size={22} className="text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-black text-2xl tracking-tight text-white leading-none">Trip For Me</h1>
                  </div>
              </div>

              {/* NAV ITEMS */}
              <div className="hidden md:flex items-center gap-6 text-sm font-bold text-white/80">
                  <button onClick={handleReset} className="hover:text-white transition uppercase tracking-wide text-xs">Plan Trip</button>
                  <div className="w-px h-4 bg-white/20"></div>
                  
                  {userProfile ? (
                      <button 
                        onClick={() => setViewState(ViewState.PROFILE)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition font-bold border border-white/10 backdrop-blur-md"
                      >
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-[10px]">
                              {userProfile.name[0]}
                          </div>
                          Profile
                      </button>
                  ) : (
                      <button 
                        onClick={() => setIsLoginOpen(true)}
                        className="flex items-center gap-2 bg-white text-blue-900 px-6 py-2.5 rounded-full transition font-bold shadow-xl hover:shadow-2xl hover:scale-105 transform active:scale-95"
                      >
                          <User size={18} /> Login
                      </button>
                  )}
              </div>
              
              {/* Mobile Menu Icon */}
              <button className="md:hidden text-white">
                  <Menu size={24} />
              </button>
          </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center justify-start flex-grow">
        
        {viewState === ViewState.FORM && (
             <div className="w-full mt-4 md:mt-8">
                 <TripForm onSubmit={handleFormSubmit} isLoading={false} />
             </div>
        )}

        {viewState === ViewState.LOADING && (
          <div className="text-center space-y-8 py-20 animate-fade-in-up">
             <div className="relative w-28 h-28 mx-auto">
               <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl"></div>
               <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
               <Plane className="absolute inset-0 m-auto text-white animate-pulse" size={36} />
             </div>
             <div>
                 <h2 className="text-4xl font-black font-display text-white mb-2 drop-shadow-md">Planning Your Journey...</h2>
                 <p className="text-blue-100 text-lg font-medium">Comparing routes & stays with AI</p>
             </div>
          </div>
        )}

        {viewState === ViewState.RESULT && tripPlan && (
          <TripResult 
            plan={tripPlan} 
            onReset={handleReset} 
            onSave={handleSaveTrip} 
          />
        )}

        {viewState === ViewState.PROFILE && renderProfile()}

        {viewState === ViewState.ERROR && (
           <div className="glass-panel p-8 rounded-3xl shadow-xl text-center max-w-md border-t-4 border-red-500">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Search Failed</h3>
              <p className="text-gray-600 mb-6 leading-relaxed font-medium">{errorMsg}</p>
              <button 
                  onClick={handleReset}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg"
              >
                  Try Again
              </button>
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-auto backdrop-blur-md bg-black/40">
         <div className="max-w-7xl mx-auto px-6 text-center text-white/60 text-sm font-medium">
            <p>&copy; 2025 Trip For Me. Designed with <Heart size={12} className="inline text-red-500" /> for travelers.</p>
         </div>
      </footer>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in">
           <div className="bg-white rounded-[32px] p-8 w-full max-w-md relative shadow-2xl m-4">
              <button onClick={() => setIsLoginOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition">
                  <X size={24} />
              </button>
              
              <div className="text-center mb-8">
                 <h2 className="text-3xl font-black font-display text-gray-900 mb-1">Welcome Back</h2>
                 <p className="text-gray-500 font-medium">Access your saved trips & deals</p>
              </div>

              <div className="space-y-4">
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl transition shadow-sm hover:shadow-md hover:bg-gray-50 flex items-center justify-center gap-3"
                  >
                     {isLoggingIn ? <Loader2 className="animate-spin text-blue-600" /> : (
                         <>
                         <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
                         Sign in with Google
                         </>
                     )}
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-100"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">Or</span>
                    <div className="flex-grow border-t border-gray-100"></div>
                  </div>

                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleGoogleLogin(); }}>
                      <div>
                          <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-2">Mobile / Email</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Enter your details" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 placeholder-gray-300 transition" 
                          />
                      </div>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transform">
                          Continue
                      </button>
                  </form>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}

export default App;