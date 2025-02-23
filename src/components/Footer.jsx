import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">Weebos</h2>
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Weebos. All rights reserved.</p>
        </div>

        
        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="/about" className="text-gray-300 hover:text-white">About</a>
          <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
          <a href="/terms" className="text-gray-300 hover:text-white">Terms</a>
          <a href="/privacy" className="text-gray-300 hover:text-white">Privacy</a>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <a href="#" className="text-gray-300 hover:text-white">🔗 Twitter</a>
          <a href="#" className="text-gray-300 hover:text-white">📘 Facebook</a>
          <a href="#" className="text-gray-300 hover:text-white">📷 Instagram</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
