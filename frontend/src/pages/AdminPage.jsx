import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Calendar, Euro, Check, X, LogOut, 
  Clock, ChevronDown, ChevronUp 
} from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("aurora_token");
    const savedUser = localStorage.getItem("aurora_user");
    
    if (!token || !savedUser) {
      window.location.href = "/raumvermietung";
      return;
    }

    const userData = JSON.parse(savedUser);
    if (!userData.is_admin) {
      window.location.href = "/raumvermietung";
      return;
    }

    setUser(userData);
    loadData(token);
  }, []);

  const loadData = async (token) => {
    const headers = { Authorization: `Bearer ${token}` };
    
    try {
      const [statsRes, pendingRes, bookingsRes, usersRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/pending-users`, { headers }),
        axios.get(`${API}/admin/bookings`, { headers }),
        axios.get(`${API}/admin/users`, { headers })
      ]);

      setStats(statsRes.data);
      setPendingUsers(pendingRes.data);
      setAllBookings(bookingsRes.data);
      setAllUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        window.location.href = "/raumvermietung";
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    const token = localStorage.getItem("aurora_token");
    try {
      await axios.post(`${API}/admin/approve-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData(token);
    } catch (err) {
      alert(err.response?.data?.detail || "Fehler beim Freischalten");
    }
  };

  const handleRejectUser = async (userId) => {
    if (!window.confirm("Benutzer wirklich ablehnen und löschen?")) return;
    
    const token = localStorage.getItem("aurora_token");
    try {
      await axios.post(`${API}/admin/reject-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      loadData(token);
    } catch (err) {
      alert(err.response?.data?.detail || "Fehler beim Ablehnen");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("aurora_token");
    localStorage.removeItem("aurora_user");
    window.location.href = "/raumvermietung";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0e4a6a] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#0e4a6a] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Aurora Admin</h1>
            <p className="text-sm text-gray-300">Raumvermietung verwalten</p>
          </div>
          <div className="flex items-center gap-4">
            <a href="/raumvermietung" className="text-sm text-gray-300 hover:text-white">
              Zur Buchungsseite
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Benutzer gesamt</p>
                  <p className="text-2xl font-bold">{stats.total_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warten auf Freigabe</p>
                  <p className="text-2xl font-bold">{stats.pending_users}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Buchungen (bezahlt)</p>
                  <p className="text-2xl font-bold">{stats.total_bookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Euro className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Umsatz (Monat)</p>
                  <p className="text-2xl font-bold">{stats.month_revenue.toFixed(2)}€</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "overview", label: "Übersicht" },
            { id: "pending", label: `Freigaben (${pendingUsers.length})` },
            { id: "bookings", label: "Buchungen" },
            { id: "users", label: "Alle Benutzer" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#0e4a6a] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {activeTab === "overview" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Aktuelle Aktivitäten</h2>
              
              {pendingUsers.length > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 font-medium">
                    {pendingUsers.length} Benutzer warten auf Freigabe
                  </p>
                </div>
              )}

              <h3 className="font-medium mb-3">Letzte Buchungen</h3>
              <div className="space-y-2">
                {allBookings.slice(0, 5).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{booking.user_name}</p>
                      <p className="text-sm text-gray-600">
                        {booking.date} • {booking.start_hour}:00 - {booking.end_hour}:00
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{booking.total_price.toFixed(2)}€</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === "paid" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {booking.status === "paid" ? "Bezahlt" : "Offen"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "pending" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Benutzer freischalten</h2>
              
              {pendingUsers.length === 0 ? (
                <p className="text-gray-600">Keine ausstehenden Freigaben</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{u.first_name} {u.last_name}</p>
                        <p className="text-sm text-gray-600">{u.email}</p>
                        {u.company && <p className="text-sm text-gray-500">Firma: {u.company}</p>}
                        {u.phone && <p className="text-sm text-gray-500">Tel: {u.phone}</p>}
                        <p className="text-xs text-gray-400 mt-1">
                          Registriert: {new Date(u.created_at).toLocaleDateString("de-DE")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveUser(u.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          data-testid={`approve-${u.id}`}
                        >
                          <Check className="w-4 h-4" />
                          Freischalten
                        </button>
                        <button
                          onClick={() => handleRejectUser(u.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          data-testid={`reject-${u.id}`}
                        >
                          <X className="w-4 h-4" />
                          Ablehnen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Alle Buchungen</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Datum</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Zeit</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Kunde</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Flipchart</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Preis</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">{booking.date}</td>
                        <td className="px-4 py-3">{booking.start_hour}:00 - {booking.end_hour}:00</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{booking.user_name}</p>
                            <p className="text-xs text-gray-500">{booking.user_email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">{booking.include_flipchart ? "Ja" : "Nein"}</td>
                        <td className="px-4 py-3 font-medium">{booking.total_price.toFixed(2)}€</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === "paid" 
                              ? "bg-green-100 text-green-700" 
                              : booking.status === "pending_payment"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}>
                            {booking.status === "paid" ? "Bezahlt" : booking.status === "pending_payment" ? "Offen" : "Storniert"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">Alle Benutzer</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">E-Mail</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Firma</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Registriert</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{u.first_name} {u.last_name}</td>
                        <td className="px-4 py-3">{u.email}</td>
                        <td className="px-4 py-3">{u.company || "-"}</td>
                        <td className="px-4 py-3">
                          {u.is_admin ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700">Admin</span>
                          ) : u.is_approved ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">Aktiv</span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">Ausstehend</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(u.created_at).toLocaleDateString("de-DE")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
