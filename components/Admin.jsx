import React from "react";
import dynamic from "next/dynamic";
import { RxTokens, RxCross2 } from "react-icons/rx";
import { BsFillInfoCircleFill, BsRocketTakeoff } from "react-icons/bs";

const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Admin = ({
  isOpen,
  onClose,
  amount,
  loading,
  icoData,
  userTokenBalance,
  isAdmin,
  wallet,
  setAmount,
  createIcoAta, // This prop is mapped to initializeIco in index.js
  buyTokens,
  userSolBalance,
  calculateProgressPercentage,
}) => {
  if (!isOpen) return null;

  const TOKEN_SYMBOL = process.env.NEXT_PUBLIC_TOKEN_SYMBOL || "SICO";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-emerald-600 px-8 py-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <RxTokens size={28} />
            <div>
              <h2 className="text-xl font-bold leading-none">ICO & Admin Panel</h2>
              <p className="text-white/70 text-sm mt-1">Manage tokens and contract state</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RxCross2 size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {!wallet.connected ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6 text-gray-500">
                <BsFillInfoCircleFill size={40} />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Wallet Disconnected</h3>
              <p className="text-gray-400 mb-8 max-w-xs">
                Please connect your wallet to access the ICO features and admin controls.
              </p>
              <WalletMultiButton />
            </div>
          ) : (
            <div className="space-y-8">
              {/* Wallet Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-800">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">Your Address</p>
                  <p className="text-white font-mono text-sm truncate">
                    {wallet.publicKey?.toString()}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-800">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">SOL Balance</p>
                  <p className="text-emerald-500 font-bold">
                    {userSolBalance?.toFixed(4)} SOL
                  </p>
                </div>
              </div>

              {/* User Token Balance */}
              <div className="bg-gradient-to-r from-purple-500/10 to-emerald-500/10 p-6 rounded-2xl border border-purple-500/20">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Your {TOKEN_SYMBOL} Balance</p>
                    <p className="text-3xl font-black text-white">
                      {parseFloat(userTokenBalance).toLocaleString()} <span className="text-lg font-normal text-gray-500">{TOKEN_SYMBOL}</span>
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-gray-900/50 rounded-2xl flex items-center justify-center border border-gray-700">
                    <img src="/logo.png" alt="Token" className="w-10 h-10" />
                  </div>
                </div>
              </div>

              {/* ICO Status */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${icoData ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                    {icoData ? 'Live ICO Status' : 'ICO Not Initialized'}
                  </h3>
                  {!icoData && (
                    <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">
                      Inactive
                    </span>
                  )}
                </div>
                
                {icoData ? (
                  <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-400 text-sm">Sale Progress</span>
                      <span className="text-emerald-500 font-bold">{calculateProgressPercentage()}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden mb-6">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${calculateProgressPercentage()}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Tokens Sold</p>
                        <p className="text-white font-bold">
                          {(icoData.tokensSold.toNumber() / 1e9).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Price</p>
                        <p className="text-white font-bold">
                          {(icoData.pricePerToken.toNumber() / 1e9).toFixed(4)} SOL
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-gray-500 text-xs uppercase font-bold mb-1">Admin</p>
                        <p className="text-white font-mono text-xs truncate">
                          {icoData.admin.toString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-500/10 border border-purple-500/20 p-8 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500">
                      <BsRocketTakeoff size={32} />
                    </div>
                    <p className="text-purple-400 font-bold text-lg">Ready to Launch?</p>
                    <p className="text-white/60 text-sm mt-2 max-w-sm mx-auto">
                      The ICO contract hasn't been initialized on the blockchain yet. 
                      {isAdmin ? " As an administrator, you can start the presale now." : " Please wait for the admin to initialize the contract."}
                    </p>
                  </div>
                )}
              </div>

              {/* Interaction Section */}
              <div className="space-y-6 pt-4 border-t border-gray-800">
                {!icoData && isAdmin && (
                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={createIcoAta}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 h-16 rounded-2xl text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Launching...</span>
                        </>
                      ) : (
                        <>
                          <BsRocketTakeoff />
                          <span>Initialize ICO Contract</span>
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-gray-500 text-center px-4 uppercase tracking-widest">
                      This will create the global state PDA and initialize the Token Vault
                    </p>
                  </div>
                )}

                {icoData && (
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="text-gray-400 text-sm mb-2 block font-medium">
                        Purchase Amount
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 text-white text-xl font-bold focus:outline-none focus:border-emerald-500 transition-all"
                      />
                      <div className="absolute right-4 top-[42px] px-3 py-1 bg-gray-700 rounded-lg text-sm font-bold text-gray-300">
                        {TOKEN_SYMBOL}
                      </div>
                    </div>

                    <button
                      onClick={buyTokens}
                      disabled={loading || !amount}
                      className="w-full bg-gradient-to-r from-purple-600 to-emerald-600 h-16 rounded-2xl text-white font-bold text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50"
                    >
                      {loading ? "Processing..." : `Purchase ${amount || ""} ${TOKEN_SYMBOL}`}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
      `}</style>
    </div>
  );
};

export default Admin;
