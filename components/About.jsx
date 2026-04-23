import React from "react";

const About = () => {
  return (
    <div className="py-20 bg-gray-900 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-gray-800 rounded-2xl p-4 border border-gray-700">
                <img 
                  src="/theblockchaincoders.jpg" 
                  alt="About Solaris" 
                  className="rounded-xl w-full h-auto object-cover shadow-2xl"
                />
              </div>
              
              {/* Floating Stat */}
              <div className="absolute -bottom-10 -right-6 md:right-10 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl animate-bounce-slow">
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">100%</p>
                <p className="text-gray-400 text-sm">Decentralized</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <h4 className="text-emerald-500 font-bold tracking-widest uppercase mb-4">About the Project</h4>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
              Revolutionizing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">Solana Ecosystem</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Solaris is a next-generation decentralized platform built on the high-performance Solana blockchain. 
              We are building a comprehensive ecosystem that bridges the gap between traditional finance and DeFi, 
              offering lightning-fast transactions and minimal fees.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0 text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">High Performance</h3>
                  <p className="text-gray-400 text-sm">Processing 65,000+ transactions per second with sub-second finality.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 text-emerald-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-2">Maximum Security</h3>
                  <p className="text-gray-400 text-sm">Audited smart contracts ensuring your assets are always safe and secure.</p>
                </div>
              </div>
            </div>

            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-full text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 transition duration-300">
              Read Whitepaper
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
