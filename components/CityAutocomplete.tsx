import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
  name: string;
}

const EXTENDED_CITIES = [
  // METROS
  "New Delhi, India", "Mumbai, India", "Bangalore, India", "Chennai, India", "Kolkata, India", "Hyderabad, India", "Pune, India", "Ahmedabad, India",
  
  // NCR & SATELLITES
  "Gurgaon, India", "Noida, India", "Ghaziabad, India", "Faridabad, India", "Thane, India", "Navi Mumbai, India", "Greater Noida, India", "Manesar, India", "Kalyan-Dombivli, India", "Vasai-Virar, India",
  
  // NORTH INDIA - SMALL & LARGE
  "Jaipur, India", "Udaipur, India", "Jodhpur, India", "Jaisalmer, India", "Ajmer, India", "Pushkar, India", "Bikaner, India", "Kota, India", "Mount Abu, India", "Alwar, India", "Chittorgarh, India", "Bundi, India", "Mandawa, India", "Neemrana, India", "Ranthambore, India", "Bharatpur, India",
  "Lucknow, India", "Kanpur, India", "Varanasi, India", "Agra, India", "Prayagraj (Allahabad), India", "Meerut, India", "Bareilly, India", "Aligarh, India", "Moradabad, India", "Jhansi, India", "Mathura, India", "Vrindavan, India", "Ayodhya, India", "Gorakhpur, India", "Firozabad, India", "Muzaffarnagar, India", "Saharanpur, India", "Noida, India",
  "Chandigarh, India", "Amritsar, India", "Ludhiana, India", "Jalandhar, India", "Patiala, India", "Bathinda, India", "Pathankot, India", "Hoshiarpur, India", "Kapurthala, India", "Mohali, India",
  "Dehradun, India", "Haridwar, India", "Rishikesh, India", "Nainital, India", "Mussoorie, India", "Almora, India", "Ranikhet, India", "Auli, India", "Lansdowne, India", "Kedarnath, India", "Badrinath, India", "Joshimath, India", "Mukteshwar, India", "Kausani, India", "Bhimtal, India", "Chopta, India",
  "Shimla, India", "Manali, India", "Dharamshala, India", "McLeod Ganj, India", "Dalhousie, India", "Kasol, India", "Spiti Valley, India", "Kasauli, India", "Bir Billing, India", "Kullu, India", "Chamba, India", "Khajjiar, India", "Palampur, India", "Solan, India", "Mandi, India", "Tirthan Valley, India",
  "Srinagar, India", "Jammu, India", "Leh, India", "Gulmarg, India", "Pahalgam, India", "Kargil, India", "Sonamarg, India", "Patnitop, India", "Nubra Valley, India",
  
  // WEST INDIA - SMALL & LARGE
  "Goa, India", "Panaji, India", "Madgaon, India", "Vasco da Gama, India", "Mapusa, India", "Calangute, India",
  "Surat, India", "Vadodara, India", "Rajkot, India", "Bhavnagar, India", "Jamnagar, India", "Gandhinagar, India", "Bhuj, India", "Kutch, India", "Dwarka, India", "Somnath, India", "Diu, India", "Daman, India", "Silvassa, India", "Junagadh, India", "Anand, India", "Navsari, India", "Vapi, India", "Porbandar, India", "Gir, India",
  "Nagpur, India", "Nashik, India", "Aurangabad, India", "Solapur, India", "Kolhapur, India", "Amravati, India", "Lonavala, India", "Mahabaleshwar, India", "Alibaug, India", "Shirdi, India", "Ratnagiri, India", "Matheran, India", "Panchgani, India", "Khandala, India", "Lavasa, India", "Tarkarli, India", "Malvan, India", "Ganpatipule, India", "Igatpuri, India", "Karjat, India", "Bhandardara, India",
  
  // CENTRAL INDIA - SMALL & LARGE
  "Bhopal, India", "Indore, India", "Gwalior, India", "Jabalpur, India", "Ujjain, India", "Khajuraho, India", "Pachmarhi, India", "Orchha, India", "Sanchi, India", "Bandhavgarh, India", "Kanha, India", "Pench, India", "Mandu, India", "Omkareshwar, India", "Maheshwar, India", "Satna, India", "Rewa, India",
  "Raipur, India", "Bilaspur, India", "Bhilai, India", "Jagdalpur, India", "Durg, India", "Korba, India",

  // EAST INDIA - SMALL & LARGE
  "Patna, India", "Gaya, India", "Muzaffarpur, India", "Bhagalpur, India", "Bodh Gaya, India", "Rajgir, India", "Nalanda, India", "Vaishali, India", "Darbhanga, India",
  "Ranchi, India", "Jamshedpur, India", "Dhanbad, India", "Deoghar, India", "Bokaro, India", "Hazaribagh, India", "Giridih, India",
  "Bhubaneswar, India", "Cuttack, India", "Puri, India", "Rourkela, India", "Konark, India", "Gopalpur, India", "Sambalpur, India", "Chilika, India", "Paradip, India", "Baripada, India",
  "Darjeeling, India", "Siliguri, India", "Digha, India", "Kalimpong, India", "Sundarbans, India", "Mandarmani, India", "Shantiniketan, India", "Murshidabad, India", "Kurseong, India", "Mirik, India", "Mayapur, India", "Bishnupur, India", "Asansol, India", "Durgapur, India", "Kharagpur, India", "Haldia, India",
  
  // NORTH EAST INDIA - SMALL & LARGE
  "Guwahati, India", "Shillong, India", "Gangtok, India", "Cherrapunji, India", "Kaziranga, India", "Tawang, India", "Imphal, India", "Agartala, India", "Aizawl, India", "Kohima, India", "Dimapur, India", "Ziro, India", "Majuli, India", "Mawlynnong, India", "Dawki, India", "Pelling, India", "Lachung, India", "Itanagar, India", "Pasighat, India", "Bomdila, India", "Silchar, India", "Tezpur, India", "Jorhat, India", "Dibrugarh, India", "Tinsukia, India",
  
  // SOUTH INDIA - SMALL & LARGE
  "Visakhapatnam, India", "Vijayawada, India", "Guntur, India", "Tirupati, India", "Kurnool, India", "Rajahmundry, India", "Araku Valley, India", "Nellore, India", "Kakinada, India", "Anantapur, India", "Srisailam, India", "Mantralayam, India", "Puttaparthi, India", "Lepakshi, India",
  "Kochi, India", "Thiruvananthapuram, India", "Kozhikode, India", "Thrissur, India", "Munnar, India", "Alleppey, India", "Wayanad, India", "Varkala, India", "Kovalam, India", "Thekkady, India", "Kumarakom, India", "Kollam, India", "Palakkad, India", "Kannur, India", "Kasaragod, India", "Vagamon, India", "Bekal, India", "Guruvayur, India", "Sabarimala, India",
  "Coimbatore, India", "Madurai, India", "Tiruchirappalli, India", "Salem, India", "Tirunelveli, India", "Vellore, India", "Ooty, India", "Kodaikanal, India", "Rameswaram, India", "Kanyakumari, India", "Mahabalipuram, India", "Thanjavur, India", "Yercaud, India", "Erode, India", "Tiruppur, India", "Thoothukudi, India", "Nagercoil, India", "Dindigul, India", "Kanchipuram, India", "Chidambaram, India", "Kumbakonam, India", "Velankanni, India", "Coonoor, India", "Hogenakkal, India", "Yelagiri, India", "Kotagiri, India",
  "Mysore, India", "Mangalore, India", "Hubli, India", "Belgaum, India", "Hampi, India", "Coorg, India", "Gokarna, India", "Udupi, India", "Chikmagalur, India", "Dandeli, India", "Murudeshwar, India", "Bijapur, India", "Shimoga, India", "Davangere, India", "Bellary, India", "Gulbarga, India", "Bidar, India", "Hassan, India", "Sakleshpur, India", "Nandi Hills, India", "Bandipur, India", "Nagarhole, India", "Badami, India", "Pattadakal, India", "Aihole, India", "Sringeri, India", "Dharmasthala, India", "Kukke Subramanya, India",
  "Pondicherry, India", "Auroville, India", "Karaikal, India", "Mahe, India", "Yanam, India",
  
  // ISLANDS
  "Port Blair, Andaman", "Havelock Island, Andaman", "Neil Island, Andaman", "Ross Island, Andaman", "Baratang Island, Andaman", "Diglipur, Andaman",
  "Agatti, Lakshadweep", "Kavaratti, Lakshadweep", "Bangaram, Lakshadweep", "Minicoy, Lakshadweep", "Kalpeni, Lakshadweep",

  // INTERNATIONAL POPULAR
  "Dubai, UAE", "Abu Dhabi, UAE", "London, UK", "New York, USA", "San Francisco, USA", "Singapore", 
  "Bangkok, Thailand", "Phuket, Thailand", "Krabi, Thailand", "Pattaya, Thailand", "Chiang Mai, Thailand",
  "Bali, Indonesia", "Jakarta, Indonesia",
  "Paris, France", "Rome, Italy", "Venice, Italy", "Zurich, Switzerland", "Amsterdam, Netherlands", "Barcelona, Spain",
  "Tokyo, Japan", "Osaka, Japan", "Seoul, South Korea",
  "Maldives", "Colombo, Sri Lanka", "Kandy, Sri Lanka", "Bentota, Sri Lanka", "Ella, Sri Lanka", "Nuwara Eliya, Sri Lanka",
  "Kathmandu, Nepal", "Pokhara, Nepal", "Chitwan, Nepal", "Lumbini, Nepal",
  "Thimphu, Bhutan", "Paro, Bhutan", "Punakha, Bhutan",
  "Istanbul, Turkey", "Cappadocia, Turkey", "Antalya, Turkey",
  "Cairo, Egypt", "Sharm El Sheikh, Egypt", 
  "Cape Town, South Africa", "Johannesburg, South Africa",
  "Sydney, Australia", "Melbourne, Australia", "Gold Coast, Australia"
];

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({ value, onChange, placeholder, icon, className, name }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    
    if (val.length > 0) {
      const lowerVal = val.toLowerCase();
      // Improved matching algorithm: 
      // 1. Matches beginning of city name (High priority)
      // 2. Matches anywhere in string (Lower priority)
      // 3. Includes small cities/towns in the search
      
      const filtered = EXTENDED_CITIES.filter(city => 
        city.toLowerCase().includes(lowerVal)
      ).sort((a, b) => {
          const aStarts = a.toLowerCase().startsWith(lowerVal);
          const bStarts = b.toLowerCase().startsWith(lowerVal);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
      }).slice(0, 10); 
      
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelect = (city: string) => {
    onChange(city);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className={`input-group ${className}`}>
        {icon}
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInput}
          onFocus={() => value.length > 0 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-slate-800 font-bold placeholder-slate-400"
          autoComplete="off"
        />
      </div>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-md border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
          {suggestions.map((city, index) => (
            <li 
              key={index}
              onClick={() => handleSelect(city)}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm font-bold text-slate-700 flex items-center gap-2 border-b border-slate-50 last:border-0"
            >
              <MapPin size={14} className="text-blue-400 flex-shrink-0" />
              <span className="truncate">{city}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityAutocomplete;