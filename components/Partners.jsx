import React from "react";

const Partners = () => {
  return (
    <div className="py-20 bg-gray-900 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-gray-500 font-medium uppercase tracking-widest text-sm">Trusted by Industry Leaders</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Replace with actual partner logos or placeholders */}
          <div className="flex items-center space-x-2 text-white font-bold text-2xl">
            <span className="text-purple-500">◈</span> SOLANA
          </div>
          <div className="flex items-center space-x-2 text-white font-bold text-2xl">
            <span className="text-emerald-500">▲</span> PHANTOM
          </div>
          <div className="flex items-center space-x-2 text-white font-bold text-2xl">
            <span className="text-blue-500">●</span> SERUM
          </div>
          <div className="flex items-center space-x-2 text-white font-bold text-2xl">
            <span className="text-pink-500">◆</span> RAYDIUM
          </div>
          <div className="flex items-center space-x-2 text-white font-bold text-2xl">
            <span className="text-orange-500">▼</span> PYTH
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
