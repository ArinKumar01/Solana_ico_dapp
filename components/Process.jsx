import React from "react";

const Process = () => {
  const steps = [
    {
      num: "01",
      title: "Connect Wallet",
      desc: "Connect your Phantom or Solflare wallet to get started."
    },
    {
      num: "02",
      title: "Select Amount",
      desc: "Enter the amount of SICO tokens you want to purchase."
    },
    {
      num: "03",
      title: "Confirm Transaction",
      desc: "Confirm the transaction in your wallet and wait for processing."
    },
    {
      num: "04",
      title: "Receive Tokens",
      desc: "Tokens will be instantly delivered to your connected wallet."
    }
  ];

  return (
    <div className="py-24 bg-gray-800/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-emerald-500 font-bold tracking-widest uppercase mb-4">How it Works</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple Steps to Buy</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-purple-500/30 to-transparent z-0"></div>
              )}
              <div className="bg-gray-800 p-8 rounded-3xl border border-gray-700 relative z-10 hover:border-emerald-500/50 transition-colors duration-300">
                <span className="text-5xl font-black text-gray-700/30 absolute top-4 right-6">{step.num}</span>
                <h4 className="text-xl font-bold text-white mb-4 relative z-10">{step.title}</h4>
                <p className="text-gray-400 relative z-10">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Process;
