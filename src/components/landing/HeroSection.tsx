"use client";

import { CheckCircle2, PlayCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-[70px] overflow-hidden bg-gradient-to-b from-white to-[#fdf2f8] flex items-center">
            {/* Background Decorative Blob */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-pink-200/40 to-violet-200/40 rounded-full blur-3xl -z-10 animate-pulse-slow" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16 py-12 lg:py-20">

                    {/* Left Column (60%) */}
                    <div className="w-full lg:w-[60%] space-y-8 text-center lg:text-left">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-6xl lg:text-[64px] font-extrabold text-gray-900 leading-[1.1]"
                        >
                            Your Safety Network,<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                                Always One Tap Away
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0"
                        >
                            Connect with your trusted circle. Share your location discreetly.
                            Get help instantly when you need it most.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
                        >
                            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center">
                                Create Your Circle (Free) &rarr;
                            </Link>
                            <button className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-pink-100 text-pink-600 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-pink-50 transition-colors">
                                <PlayCircle className="w-5 h-5" />
                                Watch Demo
                            </button>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-4"
                        >
                            {[
                                "End-to-end encrypted",
                                "100% Free",
                                "Works offline"
                            ].map((text, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    {text}
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Column (40%) - Phone Illustration Mockup */}
                    <div className="w-full lg:w-[40%] relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, type: "spring" }}
                            className="relative mx-auto w-full max-w-[320px] aspect-[1/2] rounded-[40px] border-[8px] border-gray-900 bg-gray-50 shadow-2xl overflow-hidden"
                        >
                            {/* Phone Header Strip */}
                            <div className="absolute top-0 w-full h-12 bg-gray-900 flex justify-center items-end pb-2 rounded-t-[32px] z-20">
                                <div className="w-24 h-4 bg-black rounded-full mb-1 border border-gray-800" />
                            </div>

                            {/* Mock App Interface inside Phone */}
                            <div className="pt-16 px-4 pb-4 h-full flex flex-col items-center">
                                <div className="w-full flex justify-between items-center mb-10">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-pink-200 border-2 border-white" />
                                        <div className="w-8 h-8 rounded-full bg-violet-200 border-2 border-white" />
                                        <div className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">+2</div>
                                    </div>
                                    <div className="h-8 px-3 rounded-full bg-green-100 text-green-700 font-semibold text-xs flex items-center">
                                        Active
                                    </div>
                                </div>

                                {/* Large SOS Button Mock */}
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-48 h-48 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-xl flex flex-col items-center justify-center text-white cursor-pointer relative"
                                >
                                    <span className="animate-ping absolute inline-flex h-full w-full border-4 border-pink-400 rounded-full opacity-30"></span>
                                    <span className="text-4xl font-black tracking-widest z-10">SOS</span>
                                    <span className="text-xs uppercase font-bold opacity-80 z-10 mt-1">Hold 3s to alert</span>
                                </motion.div>

                                {/* Location card mock */}
                                <div className="mt-auto w-full rounded-2xl bg-white shadow-sm border border-gray-100 p-4">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full" />
                                        </div>
                                        <div>
                                            <div className="h-2.5 w-24 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-2 w-32 bg-gray-100 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Floating decorative elements */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="absolute top-20 -left-12 bg-white p-3 rounded-2xl shadow-lg border border-gray-50 flex items-center gap-2 z-30"
                        >
                            <span className="flex h-3 w-3 rounded-full bg-pink-500" />
                            <span className="text-xs font-bold text-gray-700">Alert Sent!</span>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
