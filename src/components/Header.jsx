import React from "react";

const Header = () => {
  return (
    <div className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-3xl font-nunito font-extrabold">WEEBOS</h1>
      <input
        type="text"
        placeholder="Search..."
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Header; // ✅ Ensure this is present!
