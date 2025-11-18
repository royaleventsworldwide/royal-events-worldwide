// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/edutainment" element={<h1>Edutainment Page</h1>} />
          <Route path="/wellness" element={<h1>Wellness Page</h1>} />
          <Route path="/bookings" element={<h1>Bookings Page</h1>} />
          <Route path="/contact" element={<h1>Contact Page</h1>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;