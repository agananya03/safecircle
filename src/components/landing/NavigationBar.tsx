"use client";

import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export function NavigationBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "About", href: "#about" },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-[70px] flex flex-col justify-center ${isScrolled ? "bg-white shadow-sm" : "bg-white/80 backdrop-blur-md"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-br from-pink-500 to-violet-500 rounded-lg p-1.5 shadow-md">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 group-hover:text-pink-500 transition-colors">
                        SafeCircle
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="text-sm font-semibold text-white bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                        Get Started &rarr;
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-gray-600 hover:text-gray-900"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="absolute top-[70px] left-0 w-full bg-white border-b border-gray-100 shadow-lg md:hidden flex flex-col items-center py-6 gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-lg font-medium text-gray-700 hover:text-pink-500"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex flex-col items-center gap-4 w-full px-6 pt-4 border-t border-gray-100">
                        <Link
                            href="/login"
                            className="w-full text-center py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-lg"
                        >
                            Login
                        </Link>
                        <Link
                            href="/register"
                            className="w-full text-center py-3 text-white bg-gradient-to-r from-pink-500 to-violet-500 rounded-full font-semibold shadow-md"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
