import React from "react";

const steps = [
  {
    phase: "Phase 1",
    title: "The Genesis",
    date: "Q1 2024",
    status: "Completed",
    items: ["Token Design", "Website Launch", "Smart Contract Audit", "Community Building"]
  },
  {
    phase: "Phase 2",
    title: "Expansion",
    date: "Q2 2024",
    status: "Current",
    items: ["Public Presale", "Exchange Listings", "Partnership Program", "Governance Launch"]
  },
  {
    phase: "Phase 3",
    title: "Ecosystem",
    date: "Q3 2024",
    status: "Upcoming",
    items: ["DeFi Integration", "Staking Dashboard", "Mobile App Beta", "Cross-chain Bridge"]
  },
  {
    phase: "Phase 4",
    title: "Maturity",
    date: "Q4 2024",
    status: "Upcoming",
    items: ["Mainnet Evolution", "DAO Management", "Global Marketing", "Institutional Tools"]
  }
];

const Roadmap = () => {
  return (
    <div className="py-24 bg-gray-900 overflow-hidden" id="roadmap">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-emerald-500 font-bold tracking-widest uppercase mb-4">The Journey</h2>
          <h3 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Roadmap</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Following a structured path to ensure sustainable growth and long-term value for our community.
          </p>
        </div>

        <div className="relative">
          {/* Vertical Line for desktop */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-purple-500/50 via-emerald-500/50 to-purple-500/50 hidden lg:block"></div>

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 w-full lg:px-12">
                  <div className={`p-8 bg-gray-800 rounded-3xl border border-gray-700 relative group hover:border-purple-500/50 transition-all duration-300 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                    
                    <span className="text-emerald-500 font-mono text-sm mb-2 block">{step.date}</span>
                    <h4 className="text-2xl font-bold text-white mb-2">{step.phase}: {step.title}</h4>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 ${step.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-500' : step.status === 'Current' ? 'bg-purple-500/20 text-purple-500 animate-pulse' : 'bg-gray-700 text-gray-400'}`}>
                      {step.status}
                    </span>
                    
                    <ul className={`space-y-3 ${index % 2 === 0 ? 'lg:items-end' : 'lg:items-start'} flex flex-col`}>
                      {step.items.map((item, i) => (
                        <li key={i} className="text-gray-400 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Center Circle */}
                <div className="relative z-10 my-8 lg:my-0">
                  <div className="w-12 h-12 rounded-full bg-gray-900 border-4 border-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
                  </div>
                </div>

                <div className="lg:w-1/2 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
