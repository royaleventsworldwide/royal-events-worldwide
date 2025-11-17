import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/edutainment" element={<h1>Edutainment Page</h1>} />
        <Route path="/wellness" element={<h1>Wellness Page</h1>} />
        <Route path="/bookings" element={<h1>Bookings Page</h1>} />
        <Route path="/contact" element={<h1>Contact Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;