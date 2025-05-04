import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext"; // Adjust path as needed

const Footer = () => {
  const { theme } = useContext(ThemeContext); // Get theme from context

  return (
    <footer
      className={`w-full py-6 ${
        theme === "dark" ? "bg-gray-950 text-gray-400" : "bg-gray-200 text-gray-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Weebos</h2>
          <p className="text-sm">© {new Date().getFullYear()} Weebos. All rights reserved.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/about" className="hover:underline">About</a>
          <a href="/contact" className="hover:underline">Contact</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/privacy" className="hover:underline">Privacy</a>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="hover:underline">🔗 Twitter</a>
          <a href="#" className="hover:underline">📘 Facebook</a>
          <a href="#" className="hover:underline">📷 Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;