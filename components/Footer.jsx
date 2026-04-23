import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaTelegram, FaDiscord, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Solaris" fill className="object-contain" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-emerald-500">
                Solaris
              </span>
            </Link>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Leading the way in Solana-based decentralized finance. Join us in building the future of the open economy.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-500 hover:text-white transition-all duration-300">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300">
                <FaTelegram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-indigo-500 hover:text-white transition-all duration-300">
                <FaDiscord size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-300">
                <FaGithub size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">Github</a></li>
              <li><a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">Audit Report</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link href="#home" className="text-gray-400 hover:text-purple-500 transition-colors">Home</Link></li>
              <li><Link href="#features" className="text-gray-400 hover:text-purple-500 transition-colors">Features</Link></li>
              <li><Link href="#about" className="text-gray-400 hover:text-purple-500 transition-colors">About</Link></li>
              <li><Link href="#roadmap" className="text-gray-400 hover:text-purple-500 transition-colors">Roadmap</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Subscribe</h4>
            <p className="text-gray-400 mb-4 text-sm">Get the latest updates and news.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button className="mt-4 w-full bg-gradient-to-r from-purple-600 to-emerald-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© 2024 Solaris ICO. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
