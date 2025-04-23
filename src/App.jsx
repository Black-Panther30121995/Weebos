// src/App.jsx
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Header from "./components/Header";
import ComicReader from "./pages/ComicReader";
import Upload from "./pages/Upload";
import Footer from "./components/Footer";
import GenrePage from "./pages/GenrePage"; // Import the new GenrePage

function App() {
  console.log("App rendered");
  return (
    <ThemeProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comic/:title" element={<ComicReader />} />
        <Route path="/comic/:title/:chapter" element={<ComicReader />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/upload/:title" element={<Upload />} />
        <Route path="/genre/:genre" element={<GenrePage />} /> {/* New route for GenrePage */}
      </Routes>
      <Footer />
    </ThemeProvider>
  );
}

export default App;