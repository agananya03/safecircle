import Link from "next/link";
import { Shield, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-[#111827] text-gray-400 py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                {/* Brand Column */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-pink-500 to-violet-500 rounded-lg p-1.5">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">SafeCircle</span>
                    </div>
                    <p className="text-sm">
                        Your safety network, always. Connect with trusted circles and get help instantly when you need it most.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                        <a href="#" className="hover:text-pink-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-pink-500 transition-colors"><Facebook className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-pink-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                        <a href="#" className="hover:text-pink-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
                    </div>
                </div>

                {/* Product Column */}
                <div>
                    <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Product</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="#features" className="hover:text-pink-500 transition-colors">Features</Link></li>
                        <li><Link href="#how-it-works" className="hover:text-pink-500 transition-colors">How It Works</Link></li>
                        <li><Link href="#pricing" className="hover:text-pink-500 transition-colors">Pricing</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Download</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Roadmap</Link></li>
                    </ul>
                </div>

                {/* Resources Column */}
                <div>
                    <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Resources</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="/safety-tips" className="hover:text-pink-500 transition-colors">Safety Tips</Link></li>
                        <li><Link href="/support" className="hover:text-pink-500 transition-colors">Help Center</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">User Guide</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">API Docs</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Status</Link></li>
                    </ul>
                </div>

                {/* Company Column */}
                <div>
                    <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm">Company</h3>
                    <ul className="space-y-4 text-sm">
                        <li><Link href="#about" className="hover:text-pink-500 transition-colors">About Us</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Blog</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Press Kit</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Careers</Link></li>
                        <li><Link href="#" className="hover:text-pink-500 transition-colors">Contact</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs gap-4">
                <p>&copy; {new Date().getFullYear()} SafeCircle. All rights reserved.</p>
                <div className="flex gap-6">
                    <Link href="/privacy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-pink-500 transition-colors">Terms of Service</Link>
                    <Link href="#" className="hover:text-pink-500 transition-colors">Cookie Policy</Link>
                </div>
            </div>
        </footer>
    );
}
