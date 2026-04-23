import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Six, Seven } from "./SVG/index";

// Dynamically import WalletMultiButton with SSR disabled
const WalletMultiButton = dynamic(
  () =>
    import("@solana/wallet-adapter-react-ui").then(
      (mod) => mod.WalletMultiButton
    ),
  { ssr: false }
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState(null);

  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        try {
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (e) {
          console.error("Error fetching balance:", e);
        }
      } else {
        setBalance(null);
      }
    };

    fetchBalance();
    const id = setInterval(fetchBalance, 10000); // Update every 10s
    return () => clearInterval(id);
  }, [connected, publicKey, connection]);

  const menuItems = [
    { title: "Home", path: "#home", isScrollspy: true },
    { title: "Roadmap", path: "#roadmap", isScrollspy: true },
    { title: "Features", path: "#features", isScrollspy: true },
    { title: "About", path: "#about", isScrollspy: true },
  ];

  const handleScrollspy = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header-area relative z-50">
      <div
        className={`xb-header fixed top-0 left-0 right-0 transition-all duration-300 ${
          isSticky ? "py-2 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800" : "py-4 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="header__wrap flex items-center justify-between">

            {/* Logo */}
            <div className="header-logo">
              <Link href="/">
                <div className="flex items-center group">
                  <div className="relative w-10 h-10 md:w-12 md:h-12 transition-transform duration-300 group-hover:scale-110">
                    <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
                  </div>
                  <span className="ml-2 text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-emerald-500">
                    Solaris
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:block">
              <nav className="main-menu">
                <ul className="flex space-x-8">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      {item.isScrollspy ? (
                        <a
                          href={item.path}
                          onClick={(e) => handleScrollspy(e, item.path)}
                          className="text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                        >
                          {item.title}
                        </a>
                      ) : (
                        <Link href={item.path} className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                          {item.title}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              
              {mounted && connected && balance !== null && (
                <div className="hidden md:flex items-center px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-gray-300 text-sm font-medium">
                    {balance.toFixed(3)} SOL
                  </span>
                </div>
              )}

              {/* Wallet */}
              {mounted && (
                <div className="wallet-adapter-wrapper">
                  <WalletMultiButton />
                </div>
              )}

              {/* Mobile Toggle */}
              <div className="lg:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {isMobileMenuOpen ? <Six /> : <Seven />}
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-gray-900 border-l border-gray-800 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
               <span className="text-xl font-bold text-white">Menu</span>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                 <Six />
               </button>
            </div>
            
            {connected && balance !== null && (
              <div className="flex items-center p-3 bg-gray-800 rounded-xl mb-6 border border-gray-700">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                 <span className="text-gray-300 text-sm font-medium">
                    {balance.toFixed(4)} SOL
                  </span>
              </div>
            )}

            <ul className="flex flex-col space-y-6">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.isScrollspy ? (
                    <a
                      href={item.path}
                      onClick={(e) => handleScrollspy(e, item.path)}
                      className="text-gray-300 hover:text-white text-lg font-medium block"
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link href={item.path} className="text-gray-300 hover:text-white text-lg font-medium block">
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;