import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ExpertsPage from "./pages/ExpertsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ExpertsPage />} />
          <Route path="/experten" element={<ExpertsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
