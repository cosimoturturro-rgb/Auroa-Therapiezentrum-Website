import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Check, Calendar, Clock } from "lucide-react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BookingSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("checking");
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const token = localStorage.getItem("aurora_token");
    if (!token) {
      setStatus("error");
      return;
    }

    // Poll for payment status
    const checkStatus = async (attempts = 0) => {
      if (attempts >= 10) {
        setStatus("timeout");
        return;
      }

      try {
        const res = await axios.get(`${API}/payments/status/${sessionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.payment_status === "paid") {
          setStatus("success");
          
          // Load bookings to get the latest one
          const bookingsRes = await axios.get(`${API}/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (bookingsRes.data.length > 0) {
            const latestPaid = bookingsRes.data.find(b => b.status === "paid");
            if (latestPaid) setBooking(latestPaid);
          }
        } else if (res.data.status === "expired") {
          setStatus("expired");
        } else {
          // Continue polling
          setTimeout(() => checkStatus(attempts + 1), 2000);
        }
      } catch (err) {
        console.error(err);
        setTimeout(() => checkStatus(attempts + 1), 2000);
      }
    };

    checkStatus();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === "checking" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#0e4a6a] border-t-transparent mx-auto mb-6"></div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Zahlung wird überprüft...</h1>
            <p className="text-gray-600">Bitte warten Sie einen Moment.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Buchung bestätigt!</h1>
            <p className="text-gray-600 mb-6">
              Vielen Dank für Ihre Buchung. Sie erhalten eine Bestätigung per E-Mail.
            </p>

            {booking && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-[#0e4a6a]" />
                  <span className="font-medium">{booking.date}</span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-[#0e4a6a]" />
                  <span>{booking.start_hour}:00 - {booking.end_hour}:00 Uhr</span>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <span className="text-gray-600">Gesamtpreis</span>
                  <span className="font-semibold text-[#0e4a6a]">{booking.total_price.toFixed(2)}€</span>
                </div>
              </div>
            )}

            <a
              href="/raumvermietung"
              className="inline-block px-6 py-3 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
            >
              Zurück zur Raumvermietung
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">!</span>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Fehler</h1>
            <p className="text-gray-600 mb-6">
              Es gab ein Problem mit der Zahlung. Bitte versuchen Sie es erneut.
            </p>
            <a
              href="/raumvermietung"
              className="inline-block px-6 py-3 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
            >
              Zurück zur Raumvermietung
            </a>
          </>
        )}

        {status === "expired" && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Sitzung abgelaufen</h1>
            <p className="text-gray-600 mb-6">
              Die Zahlungssitzung ist abgelaufen. Bitte versuchen Sie es erneut.
            </p>
            <a
              href="/raumvermietung"
              className="inline-block px-6 py-3 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
            >
              Neue Buchung starten
            </a>
          </>
        )}

        {status === "timeout" && (
          <>
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-2">Statusprüfung dauert länger</h1>
            <p className="text-gray-600 mb-6">
              Die Zahlung wird noch verarbeitet. Sie erhalten eine E-Mail, sobald die Buchung bestätigt ist.
            </p>
            <a
              href="/raumvermietung"
              className="inline-block px-6 py-3 bg-[#0e4a6a] text-white rounded-lg hover:bg-[#1a6b94] transition-colors"
            >
              Zurück zur Raumvermietung
            </a>
          </>
        )}
      </div>
    </div>
  );
}
