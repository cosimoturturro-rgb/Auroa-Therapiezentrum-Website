import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExpertsPage from "./pages/ExpertsPage";
import RoomRentalPage from "./pages/RoomRentalPage";
import AdminPage from "./pages/AdminPage";
import BookingSuccessPage from "./pages/BookingSuccessPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExpertsPage />} />
          <Route path="/experten" element={<ExpertsPage />} />
          <Route path="/raumvermietung" element={<RoomRentalPage />} />
          <Route path="/raumvermietung/booking-success" element={<BookingSuccessPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
