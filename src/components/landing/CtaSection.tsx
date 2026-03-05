"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield } from "lucide-react";

export function CtaSection() {
    return (
        <section className="bg-gradient-to-br from-pink-500 to-purple-600 py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse-slow" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-2xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-xl border border-white/30"
                >
                    <Shield className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight"
                >
                    Ready to Feel Safer?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-2xl text-pink-100 mb-12"
                >
                    Join 50,000+ women who never walk alone.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <Link
                        href="/register"
                        className="px-10 py-5 bg-white text-pink-600 rounded-full font-bold text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300"
                    >
                        Create Your Free Account &rarr;
                    </Link>
                    <p className="text-pink-200 mt-6 text-sm font-medium">
                        No credit card required. Set up in 2 minutes.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
