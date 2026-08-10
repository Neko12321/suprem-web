"use client";
import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "ANA SAYFA" },
  { href: "/hakkimizda", label: "HAKKIMIZDA" },
  { href: "/hizmetler", label: "HİZMETLER" },
  { href: "/fiyatlar", label: "FİYATLAR" },
  { href: "/blog", label: "BLOG" },
  { href: "/randevu", label: "RANDEVU AL" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-white text-lg">
              SR
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-wider">SUPREM</span>
              <span className="text-purple-400 text-[10px] tracking-[0.3em] -mt-1">RECORD</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wider transition-colors hover:text-purple-400 ${
                  link.label === "RANDEVU AL"
                    ? "bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                    : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-[#0a0a0f]/95 border-t border-purple-900/30">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block text-sm tracking-wider transition-colors hover:text-purple-400 ${
                  link.label === "RANDEVU AL"
                    ? "bg-purple-600 text-white px-4 py-2 rounded-lg text-center"
                    : "text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
