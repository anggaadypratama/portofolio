import React from "react";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-20 border-t-4 border-primary">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 px-4 text-center md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-mono font-bold text-xl sm:text-2xl uppercase tracking-tighter">
            Angga Ady Pratama
          </span>
          <span className="text-gray-500 text-sm mt-2">
            © {new Date().getFullYear()} All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
