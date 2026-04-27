import { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, Users, Wifi, Wind, Monitor, 
  ChevronLeft, ChevronRight, Check, X, LogOut,
  Mail, Phone, User, Building, Eye, EyeOff
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = createContext(null);

const useAuth = () => useContext(AuthContext);

// Room images (placeholders - will be replaced with actual images)
const roomImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&h=500&fit=crop"
];

// ============== AUTH COMPONENTS ==============

const LoginForm = ({ onSwitch, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("aurora_token", res.data.token);
      localStorage.setItem("aurora_user", JSON.stringify(res.data.user));
      onSuccess(res.data.user);
    } catch (err) {
      setError(err.response?.data?.detail || "Anmeldung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Anmelden</h2>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm text-gray-600 mb-1">E-Mail</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
            placeholder="ihre@email.de"
            required
            data-testid="login-email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Passwort</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
            placeholder="••••••••"
            required
            data-testid="login-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors disabled:opacity-50"
        data-testid="login-submit"
      >
        {loading ? "Wird angemeldet..." : "Anmelden"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Noch kein Konto?{" "}
        <button type="button" onClick={onSwitch} className="text-[#14b8a6] hover:underline">
          Jetzt registrieren
        </button>
      </p>
    </form>
  );
};

const RegisterForm = ({ onSwitch, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "",
    first_name: "", last_name: "", company: "", phone: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      return;
    }

    if (formData.password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen lang sein");
      return;
    }

    setLoading(true);

    try {
      await axios.post(`${API}/auth/register`, {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        company: formData.company || null,
        phone: formData.phone || null
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Registrierung erfolgreich!</h2>
        <p className="text-gray-600 mb-6">
          Ihr Konto muss noch freigeschaltet werden. Sie erhalten eine E-Mail, sobald Ihr Konto aktiviert wurde.
        </p>
        <button
          onClick={onSwitch}
          className="px-6 py-2 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
        >
          Zur Anmeldung
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Registrieren</h2>
      
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Vorname *</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
            required
            data-testid="register-firstname"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Nachname *</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
            required
            data-testid="register-lastname"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">E-Mail *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          required
          data-testid="register-email"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Firma (optional)</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Telefon (optional)</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Passwort *</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
            required
            minLength={6}
            data-testid="register-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Passwort bestätigen *</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14b8a6] focus:border-transparent"
          required
          data-testid="register-confirm-password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors disabled:opacity-50"
        data-testid="register-submit"
      >
        {loading ? "Wird registriert..." : "Registrieren"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Bereits registriert?{" "}
        <button type="button" onClick={onSwitch} className="text-[#14b8a6] hover:underline">
          Jetzt anmelden
        </button>
      </p>
    </form>
  );
};

// ============== BOOKING CALENDAR ==============

const BookingCalendar = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();
  
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  
  const days = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < adjustedFirstDay; i++) {
    days.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSunday = date.getDay() === 0;
    const isPast = date < today;
    
    days.push({
      day,
      date: date.toISOString().split('T')[0],
      disabled: isSunday || isPast,
      isSunday,
      isPast
    });
  }
  
  const monthNames = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember"
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
          <div key={d} className="text-center text-sm font-medium text-gray-500 py-2">
            {d}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((dayObj, idx) => (
          <div key={idx} className="aspect-square">
            {dayObj && (
              <button
                onClick={() => !dayObj.disabled && onDateSelect(dayObj.date)}
                disabled={dayObj.disabled}
                className={`w-full h-full rounded-lg text-sm font-medium transition-colors ${
                  selectedDate === dayObj.date
                    ? "bg-[#0e4a6a] text-white"
                    : dayObj.disabled
                    ? "text-gray-300 cursor-not-allowed"
                    : "hover:bg-[#14b8a6] hover:text-white"
                }`}
              >
                {dayObj.day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ============== TIME SLOT PICKER ==============

const TimeSlotPicker = ({ slots, selectedStart, selectedEnd, onSelect }) => {
  const [selecting, setSelecting] = useState(false);
  const [tempStart, setTempStart] = useState(null);
  
  const handleSlotClick = (slot) => {
    if (!slot.available) return;
    
    if (!selecting) {
      setTempStart(slot.hour);
      setSelecting(true);
      onSelect(slot.hour, slot.hour + 1);
    } else {
      if (slot.hour >= tempStart) {
        // Check if all slots between tempStart and slot.hour are available
        let allAvailable = true;
        for (let h = tempStart; h <= slot.hour; h++) {
          const s = slots.find(s => s.hour === h);
          if (!s || !s.available) {
            allAvailable = false;
            break;
          }
        }
        
        if (allAvailable) {
          onSelect(tempStart, slot.hour + 1);
        }
      }
      setSelecting(false);
      setTempStart(null);
    }
  };
  
  const isSelected = (hour) => {
    return selectedStart !== null && selectedEnd !== null && 
           hour >= selectedStart && hour < selectedEnd;
  };
  
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-3">
        {selecting ? "Wählen Sie die Endzeit" : "Wählen Sie die Startzeit"}
      </p>
      <div className="grid grid-cols-4 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.hour}
            onClick={() => handleSlotClick(slot)}
            disabled={!slot.available}
            className={`py-3 px-2 rounded-lg text-sm font-medium transition-colors ${
              isSelected(slot.hour)
                ? "bg-[#0e4a6a] text-white"
                : slot.available
                ? "bg-gray-100 hover:bg-[#14b8a6] hover:text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed line-through"
            }`}
            data-testid={`slot-${slot.hour}`}
          >
            {slot.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============== MAIN ROOM RENTAL PAGE ==============

export default function RoomRentalPage() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [roomInfo, setRoomInfo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [selectedStart, setSelectedStart] = useState(null);
  const [selectedEnd, setSelectedEnd] = useState(null);
  const [includeFlipChart, setIncludeFlipChart] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [myBookings, setMyBookings] = useState([]);

  // Check for existing auth
  useEffect(() => {
    const token = localStorage.getItem("aurora_token");
    const savedUser = localStorage.getItem("aurora_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Load room info
  useEffect(() => {
    axios.get(`${API}/room-info`).then(res => setRoomInfo(res.data)).catch(console.error);
  }, []);

  // Load availability when date changes
  useEffect(() => {
    if (selectedDate) {
      axios.get(`${API}/bookings/availability/${selectedDate}`)
        .then(res => {
          setAvailability(res.data);
          setSelectedStart(null);
          setSelectedEnd(null);
        })
        .catch(console.error);
    }
  }, [selectedDate]);

  // Load my bookings when user logs in
  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("aurora_token");
      axios.get(`${API}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setMyBookings(res.data)).catch(console.error);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("aurora_token");
    localStorage.removeItem("aurora_user");
    setUser(null);
    setMyBookings([]);
  };

  const handleTimeSelect = (start, end) => {
    setSelectedStart(start);
    setSelectedEnd(end);
  };

  const calculatePrice = () => {
    if (selectedStart === null || selectedEnd === null) return null;
    const hours = selectedEnd - selectedStart;
    const basePrice = hours * (roomInfo?.hourly_rate || 25);
    const flipChartPrice = includeFlipChart ? hours * (roomInfo?.flipchart_rate || 5) : 0;
    return { hours, basePrice, flipChartPrice, total: basePrice + flipChartPrice };
  };

  const handleBooking = async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    if (!user.is_approved) {
      alert("Ihr Konto wurde noch nicht freigeschaltet. Bitte warten Sie auf die Freischaltung.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("aurora_token");

    try {
      // Create booking
      const bookingRes = await axios.post(`${API}/bookings/create`, {
        date: selectedDate,
        start_hour: selectedStart,
        end_hour: selectedEnd,
        include_flipchart: includeFlipChart,
        notes: notes || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Create checkout session
      const checkoutRes = await axios.post(
        `${API}/payments/create-checkout/${bookingRes.data.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe
      window.location.href = checkoutRes.data.checkout_url;
    } catch (err) {
      alert(err.response?.data?.detail || "Buchung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const price = calculatePrice();

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0e3a5a]/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="hidden md:flex items-center gap-8">
                <a href="https://www.aurora-therapiezentrum.de" className="text-sm text-gray-300 hover:text-white">Aurora</a>
                <a href="https://www.aurora-therapiezentrum.de/copy-of-about-us-1" className="text-sm text-gray-300 hover:text-white">Angebot</a>
                <a href="/" className="text-sm text-gray-300 hover:text-white">Experten</a>
                <a href="/raumvermietung" className="text-sm text-[#14b8a6]">Raumvermietung</a>
                <a href="https://www.aurora-therapiezentrum.de/contact" className="text-sm text-gray-300 hover:text-white">Kontakt und Anreise</a>
              </div>
              
              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-white hidden sm:block">
                      {user.first_name} {user.last_name}
                      {!user.is_approved && <span className="text-yellow-400 ml-2">(Nicht freigeschaltet)</span>}
                    </span>
                    {user.is_admin && (
                      <a href="/admin" className="text-sm text-[#14b8a6] hover:underline">Admin</a>
                    )}
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-300 hover:text-white"
                      data-testid="logout-btn"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="px-4 py-1.5 bg-[#14b8a6] text-white text-sm rounded-full hover:bg-[#2dd4bf] transition-colors"
                    data-testid="login-btn"
                  >
                    Anmelden
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-14 relative">
          <div className="h-[400px] relative overflow-hidden">
            <img
              src={roomImages[currentImageIndex]}
              alt="Gruppentherapieraum"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Image navigation */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {roomImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    idx === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
            
            <div className="absolute bottom-12 left-0 right-0 text-center text-white">
              <h1 className="text-4xl font-semibold mb-2">Gruppentherapieraum</h1>
              <p className="text-lg opacity-90">zur Vermietung</p>
            </div>
          </div>
        </section>

        {/* Room Info */}
        <section className="py-12 px-4 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#0e4a6a] rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Stundenweise Buchung</h3>
              <p className="text-2xl font-bold text-[#0e4a6a]">25 €<span className="text-sm font-normal text-gray-600">/Stunde</span></p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#14b8a6] rounded-full flex items-center justify-center mx-auto mb-3">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Elektr. Flipchart</h3>
              <p className="text-2xl font-bold text-[#14b8a6]">+5 €<span className="text-sm font-normal text-gray-600">/Stunde</span></p>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-[#0e4a6a] rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-1">Ausstattung</h3>
              <p className="text-sm text-gray-600">Klimatisiert, WLAN, flexible Bestuhlung</p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mb-12 p-6 bg-gray-50 rounded-xl">
            <h3 className="font-semibold mb-4">Öffnungszeiten</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div><span className="text-gray-600">Mo-Do:</span> 8:00 - 19:00</div>
              <div><span className="text-gray-600">Fr:</span> 8:00 - 16:00</div>
              <div><span className="text-gray-600">Sa:</span> 9:00 - 16:00</div>
              <div><span className="text-gray-600">So:</span> Geschlossen</div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div>
              <h3 className="text-xl font-semibold mb-4">1. Datum wählen</h3>
              <BookingCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {/* Time Slots & Booking */}
            <div>
              <h3 className="text-xl font-semibold mb-4">2. Zeit wählen</h3>
              
              {selectedDate && availability ? (
                availability.closed ? (
                  <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-600">
                    An diesem Tag geschlossen
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <TimeSlotPicker
                      slots={availability.slots}
                      selectedStart={selectedStart}
                      selectedEnd={selectedEnd}
                      onSelect={handleTimeSelect}
                    />

                    {price && (
                      <div className="mt-6 pt-6 border-t">
                        {/* Flipchart Option */}
                        <label className="flex items-center gap-3 mb-4 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeFlipChart}
                            onChange={(e) => setIncludeFlipChart(e.target.checked)}
                            className="w-5 h-5 text-[#14b8a6] rounded"
                          />
                          <span>Elektronisches Flipchart hinzufügen (+{roomInfo?.flipchart_rate || 5}€/Std.)</span>
                        </label>

                        {/* Notes */}
                        <div className="mb-4">
                          <label className="block text-sm text-gray-600 mb-1">Anmerkungen (optional)</label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            rows={2}
                            placeholder="z.B. besondere Wünsche zur Bestuhlung"
                          />
                        </div>

                        {/* Price Summary */}
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{price.hours} Stunde(n) × {roomInfo?.hourly_rate || 25}€</span>
                            <span>{price.basePrice.toFixed(2)}€</span>
                          </div>
                          {includeFlipChart && (
                            <div className="flex justify-between text-sm mb-1">
                              <span>Flipchart × {price.hours} Std.</span>
                              <span>{price.flipChartPrice.toFixed(2)}€</span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-lg mt-2 pt-2 border-t">
                            <span>Gesamt</span>
                            <span className="text-[#0e4a6a]">{price.total.toFixed(2)}€</span>
                          </div>
                        </div>

                        <button
                          onClick={handleBooking}
                          disabled={loading}
                          className="w-full py-3 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors disabled:opacity-50 font-medium"
                          data-testid="book-now-btn"
                        >
                          {loading ? "Wird verarbeitet..." : user ? "Jetzt buchen & bezahlen" : "Anmelden & Buchen"}
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <div className="p-6 bg-gray-50 rounded-xl text-center text-gray-600">
                  Bitte wählen Sie zuerst ein Datum
                </div>
              )}
            </div>
          </div>

          {/* My Bookings */}
          {user && myBookings.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">Meine Buchungen</h3>
              <div className="space-y-3">
                {myBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.date}</p>
                      <p className="text-sm text-gray-600">
                        {booking.start_hour}:00 - {booking.end_hour}:00 Uhr
                        {booking.include_flipchart && " • Flipchart"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{booking.total_price.toFixed(2)}€</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "paid" 
                          ? "bg-green-100 text-green-700" 
                          : booking.status === "pending_payment"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                      }`}>
                        {booking.status === "paid" ? "Bezahlt" : booking.status === "pending_payment" ? "Offen" : "Storniert"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Auth Modal */}
        <AnimatePresence>
          {showAuth && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowAuth(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowAuth(false)}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>

                {authMode === "login" ? (
                  <LoginForm
                    onSwitch={() => setAuthMode("register")}
                    onSuccess={(userData) => {
                      setUser(userData);
                      setShowAuth(false);
                    }}
                  />
                ) : (
                  <RegisterForm
                    onSwitch={() => setAuthMode("login")}
                    onSuccess={() => setAuthMode("login")}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthContext.Provider>
  );
}
