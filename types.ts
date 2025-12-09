export interface UserPreferences {
  searchType: 'trip' | 'flight' | 'hotel' | 'train' | 'package';
  transportMode: 'any' | 'flight' | 'train' | 'bus' | 'car' | 'bike' | 'walk';
  origin: string;
  destination: string;
  startDate: string;
  returnDate?: string;
  duration: number;
  travelers: number;
  budget: 'Budget' | 'Moderate' | 'Luxury';
  travelerType: string;
  interests: string[];
  image?: string; // Base64
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  isLoggedIn: boolean;
  trips: TripPlan[];
}

export interface FlightOption {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: string;
  bookingUrl: string;
  logoColor: string;
}

export interface HotelOption {
  name: string;
  location: string;
  rating: string;
  pricePerNight: string;
  totalPrice: string;
  features: string[];
  imageUrl: string;
  bookingUrl: string;
}

export interface TransitOption {
  mode: 'Bus' | 'Train' | 'Flight' | 'Car' | 'Ferry' | 'Bike' | 'Walk';
  provider: string;
  duration: string;
  cost: string;
  frequency: string;
  bookingLink: string;
  mapLink: string;
  description: string;
  tag?: string;
}

export interface DayActivity {
  time: string;
  activity: string;
  description: string;
  location: string;
  timeSpent: string; 
  costEstimate: string;
  bookingLink?: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  theme: string;
  activities: DayActivity[];
}

export interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  miscellaneous: number;
  total: number;
  currency: string;
}

export interface TripPlan {
  id: string; // Added ID for saving/deleting
  createdAt: number; // Added timestamp
  summary: string;
  destinationInfo: string;
  suggestedFlights: FlightOption[];
  suggestedHotels: HotelOption[];
  transitOptions: TransitOption[];
  itinerary: DayItinerary[];
  budget: BudgetBreakdown;
  safetyTips: string[];
  packingList: string[];
  alternatives: string;
}

export enum ViewState {
  FORM,
  LOADING,
  RESULT,
  ERROR,
  PROFILE // Added Profile View
}