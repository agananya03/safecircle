"use client";

import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function VoiceHighlightSection() {
    return (
        <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
            {/* Decorative background waves */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <motion.div
                    animate={{ x: [0, -100, 0], scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] border-[40px] border-white rounded-[40%] animate-spin-slow"
                />
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-8 relative"
                >
                    <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"></span>
                    <Mic className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight"
                >
                    Just Say the Word
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    Hands-free emergency activation with voice commands.
                    Just say <span className="font-bold bg-white/20 px-3 py-1 rounded-lg">"Help me SafeCircle"</span> — even when your phone is locked.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <Link href="/register" className="inline-block px-8 py-4 bg-white text-pink-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        Try Voice Commands &rarr;
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
