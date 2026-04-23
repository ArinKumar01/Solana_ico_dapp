import React, { useState } from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { RxTokens } from "react-icons/rx";
import dynamic from "next/dynamic";
import { One, Two, Three, Four, Five } from "./SVG/index";
import Admin from "./Admin";

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const HeroSection = ({
  wallet,
  isAdmin,
  loading,
  icoData,
  amount,
  userSolBalance,
  userTokenBalance,
  setAmount,
  createIcoAta,
  depositIco,
  buyTokens,
}) => {
  // Use environment variables with fallbacks
  const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "SICO";
  const PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_USD_PRICE || "0.01";
  const NEXT_PER_TOKEN_USD_PRICE = process.env.NEXT_PUBLIC_NEXT_PER_TOKEN_USD_PRICE || "0.035";
  const PER_TOKEN_SOL_PRICE = process.env.NEXT_PUBLIC_PER_TOKEN_SOL_PRICE || "0.001";
  const MIN_SOL_BALANCE = process.env.NEXT_PUBLIC_MIN_SOL_BALANCE || "0.05";

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate progress percentage
  const calculateProgressPercentage = () => {
    if (!icoData || !icoData.tokensSold)
      return 0;

    const soldAmount = icoData.tokensSold.toNumber() / 1e9;
    // Since totalTokens isn't in our new state (we just sold), 
    // let's assume a target from env or just show sold vs some arbitrary target for UI
    const target = parseFloat(process.env.NEXT_PUBLIC_TOKEN_SUPPLY || "1000000000") / 1e9;
    return Math.min((soldAmount / target) * 100, 100).toFixed(2);
  };

  const executePurchase = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsLoading(true);
    await buyTokens();
    setIsLoading(false);
  };

  return (
    <div className="relative w-full min-h-screen pt-32 pb-20 overflow-hidden bg-gray-900">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-600/10 rounded-full blur-[120px]"></div>
        
        {/* Animated Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-pulse-slow"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold mb-8 animate-bounce-slow">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Presale Stage 1 is Live
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              The Future of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">
                Solana Finance
              </span>
            </h1>

            <p className="text-gray-400 text-lg md:text-xl max-w-xl mb-12 mx-auto lg:mx-0 leading-relaxed">
              Solaris is building a hyper-efficient decentralized ecosystem on Solana. 
              Join our presale and be part of the most scalable blockchain revolution.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto lg:mx-0">
              {[
                { icon: <One />, label: "Early Access", sub: "Stage 1 Sale" },
                { icon: <Two />, label: "Security", sub: "Audited Code" },
                { icon: <Three />, label: "Low Price", sub: `$${PER_TOKEN_USD_PRICE}/token` },
                { icon: <Four />, label: "Rewards", sub: "Staking Live" }
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-800/50 border border-gray-700">
                   <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                     {feat.icon}
                   </div>
                   <div>
                     <p className="text-white font-bold text-sm">{feat.label}</p>
                     <p className="text-gray-500 text-xs">{feat.sub}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Purchase Card */}
          <div className="w-full lg:w-1/2 max-w-md mx-auto">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              
              <div className="relative bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-purple-600 to-emerald-600 p-6 text-white">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xl font-bold">Buy {TOKEN_SYMBOL}</h3>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Phase 1</span>
                  </div>
                  <p className="text-white/80 text-sm">Secure your tokens at the lowest price</p>
                </div>

                <div className="p-8">
                  {/* Prices */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-800 text-center">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">Current Price</p>
                      <p className="text-white text-xl font-black">${PER_TOKEN_USD_PRICE}</p>
                    </div>
                    <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-800 text-center">
                      <p className="text-gray-500 text-xs font-bold uppercase mb-1">Next Phase</p>
                      <p className="text-white text-xl font-black">${NEXT_PER_TOKEN_USD_PRICE}</p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-gray-400 text-sm font-medium">Sale Progress</span>
                      <span className="text-emerald-500 font-bold">{calculateProgressPercentage()}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full"
                        style={{ width: `${calculateProgressPercentage()}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-3 text-xs text-gray-500">
                       <span>Raised: ${(parseFloat(icoData?.tokensSold?.toString() || "0") / 1e9 * parseFloat(PER_TOKEN_USD_PRICE)).toLocaleString()}</span>
                       <span>Remaining: {icoData ? (parseFloat(icoData.totalTokens.toString()) - parseFloat(icoData.tokensSold.toString())) / 1e9 : 0} {TOKEN_SYMBOL}</span>
                    </div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4 mb-8">
                    <div className="relative">
                      <label className="text-gray-500 text-xs font-bold uppercase mb-2 block ml-1">Quantity</label>
                      <input 
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <div className="absolute right-4 bottom-4 text-gray-500 font-bold">{TOKEN_SYMBOL}</div>
                    </div>

                    <div className="relative">
                      <label className="text-gray-500 text-xs font-bold uppercase mb-2 block ml-1">You Pay</label>
                      <input 
                        type="text"
                        value={amount ? (parseFloat(amount) * parseFloat(PER_TOKEN_SOL_PRICE)).toFixed(4) : "0.0000"}
                        readOnly
                        className="w-full bg-gray-800/50 border border-gray-700 rounded-2xl px-6 py-4 text-gray-400 text-xl font-bold"
                      />
                      <div className="absolute right-4 bottom-4 text-gray-500 font-bold">SOL</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {wallet.connected ? (
                    <button 
                      onClick={executePurchase}
                      disabled={loading || isLoading || !amount || parseFloat(amount) <= 0 || userSolBalance < parseFloat(MIN_SOL_BALANCE)}
                      className="w-full h-16 bg-gradient-to-r from-purple-600 to-emerald-600 rounded-2xl text-white font-bold text-lg shadow-xl shadow-purple-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100"
                    >
                      {loading || isLoading ? "Processing..." : userSolBalance < parseFloat(MIN_SOL_BALANCE) ? "Insufficient Balance" : "Buy Tokens Now"}
                    </button>
                  ) : (
                    <div className="wallet-btn-container">
                       <WalletMultiButton style={{ width: '100%', height: '64px', borderRadius: '1rem', justifyContent: 'center', backgroundColor: '#8b5cf6' }} />
                    </div>
                  )}

                  {/* ICO Details button */}
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full mt-4 py-4 px-6 rounded-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all flex items-center justify-center gap-2 border border-gray-700"
                  >
                    <RxTokens />
                    <span>ICO Details & Admin</span>
                  </button>

                  {/* Footer links */}
                  <div className="mt-6 flex justify-center gap-6">
                    <button className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1">
                      <RxTokens /> Whitepaper
                    </button>
                    <button className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-1">
                      <BsFillInfoCircleFill /> Audit Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Admin
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        wallet={wallet}
        isAdmin={isAdmin}
        loading={loading}
        icoData={icoData}
        amount={amount}
        userSolBalance={userSolBalance}
        userTokenBalance={userTokenBalance}
        setAmount={setAmount}
        createIcoAta={createIcoAta}
        depositIco={depositIco}
        buyTokens={buyTokens}
        calculateProgressPercentage={calculateProgressPercentage}
      />

      {/* Scroll Down */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
        <a href="#features">
          <Five />
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
