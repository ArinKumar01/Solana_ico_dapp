import React from "react";

const Token = () => {
  const details = [
    { label: "Token Name", value: "Solaris" },
    { label: "Symbol", value: "SICO" },
    { label: "Network", value: "Solana (Devnet)" },
    { label: "Decimals", value: "9" },
    { label: "Total Supply", value: "1,000,000,000" },
    { label: "Presale Allocation", value: "40%" },
    { label: "Liquidity Pool", value: "30%" },
    { label: "Team & Advisors", value: "15%" },
    { label: "Marketing", value: "10%" },
    { label: "Airdrop", value: "5%" }
  ];

  return (
    <div className="py-24 bg-gray-900 overflow-hidden relative" id="chart">
       <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-emerald-500 font-bold tracking-widest uppercase mb-4">Tokenomics</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Token Details</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="bg-gray-800 p-8 md:p-12 rounded-3xl border border-gray-700 shadow-2xl relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
             <div className="relative space-y-6">
               {details.map((detail, index) => (
                 <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-4">
                   <span className="text-gray-400 font-medium">{detail.label}</span>
                   <span className="text-white font-bold">{detail.value}</span>
                 </div>
               ))}
             </div>
          </div>

          <div className="flex flex-col items-center justify-center">
             {/* Simple Tokenomics Chart Visualization */}
             <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 rounded-full border-[30px] border-purple-600/20"></div>
                <div className="absolute inset-0 rounded-full border-[30px] border-emerald-500 border-t-transparent border-l-transparent transform rotate-45"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                   <p className="text-gray-400 text-sm">TOTAL SUPPLY</p>
                   <p className="text-3xl font-bold text-white">1B</p>
                   <p className="text-emerald-500 font-mono">SICO</p>
                </div>
             </div>
             
             <div className="mt-12 grid grid-cols-2 gap-6 w-full">
                <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
                   <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                   <span className="text-gray-300 text-sm">Public Sale (40%)</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
                   <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                   <span className="text-gray-300 text-sm">Liquidity (30%)</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
                   <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                   <span className="text-gray-300 text-sm">Team (15%)</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
                   <div className="w-4 h-4 rounded-full bg-pink-500"></div>
                   <span className="text-gray-300 text-sm">Marketing (10%)</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Token;
