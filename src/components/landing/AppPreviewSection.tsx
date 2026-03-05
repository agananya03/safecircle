"use client";

import { Smartphone, WifiOff, MapPin, Bell, Battery } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
    {
        icon: <Smartphone className="w-6 h-6 text-pink-500" />,
        title: "Progressive Web App (PWA)",
        desc: "Works perfectly on any device, no app store downloads needed."
    },
    {
        icon: <WifiOff className="w-6 h-6 text-violet-500" />,
        title: "Offline Mode",
        desc: "Core emergency features continue to function without internet access."
    },
    {
        icon: <MapPin className="w-6 h-6 text-blue-500" />,
        title: "Background Tracking",
        desc: "Your location safely updates even when your phone screen is turned off."
    },
    {
        icon: <Bell className="w-6 h-6 text-amber-500" />,
        title: "Push Notifications",
        desc: "Instant delivery of critical alerts so you never miss an emergency."
    },
    {
        icon: <Battery className="w-6 h-6 text-green-500" />,
        title: "Low Battery Mode",
        desc: "Optimized architecture to protect and preserve your device's battery life."
    }
];

export function AppPreviewSection() {
    return (
        <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">

                {/* Left: Overlapping phones (40%) */}
                <div className="w-full lg:w-[40%] relative min-h-[500px] flex justify-center lg:justify-start">
                    {/* Phone 1 (Back/Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotate: -5 }}
                        whileInView={{ opacity: 1, x: 0, rotate: -10 }}
                        viewport={{ once: true }}
                        className="absolute left-0 lg:left-[-20px] top-10 w-[240px] aspect-[1/2] rounded-[32px] bg-gray-900 border-4 border-gray-800 shadow-2xl p-2 z-10 hidden md:block"
                    >
                        <div className="w-full h-full rounded-[24px] bg-gray-50 flex flex-col p-4 opacity-75">
                            <div className="w-full h-24 bg-pink-100 rounded-xl mb-4" />
                            <div className="w-full h-12 bg-gray-200 rounded-xl mb-2" />
                            <div className="w-full h-12 bg-gray-200 rounded-xl mb-2" />
                        </div>
                    </motion.div>

                    {/* Phone 2 (Front/Center) */}
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative w-[280px] aspect-[1/2] rounded-[36px] bg-gray-900 border-[6px] border-black shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-2 z-30 mx-auto lg:mx-0"
                    >
                        {/* Notch */}
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl z-40" />
                        <div className="w-full h-full rounded-[26px] bg-white flex flex-col overflow-hidden">
                            {/* Map header mock */}
                            <div className="h-40 bg-gray-100 w-full relative">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-300 via-transparent to-transparent"></div>
                                {/* Pin */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                            </div>
                            <div className="p-4 flex-1 flex flex-col gap-3">
                                <div className="h-6 w-32 bg-gray-900 rounded-full mb-2" />
                                <div className="h-16 w-full bg-red-50 rounded-xl border border-red-100" />
                                <div className="h-16 w-full bg-pink-50 rounded-xl border border-pink-100" />
                            </div>
                            {/* Bottom Nav Mock */}
                            <div className="h-14 border-t border-gray-100 flex justify-around items-center px-4">
                                <div className="w-6 h-6 rounded-full bg-gray-300" />
                                <div className="w-6 h-6 rounded-full bg-pink-500" />
                                <div className="w-6 h-6 rounded-full bg-gray-300" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Phone 3 (Back/Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: 5 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 10 }}
                        viewport={{ once: true }}
                        className="absolute right-0 lg:-right-4 top-20 w-[240px] aspect-[1/2] rounded-[32px] bg-gray-900 border-4 border-gray-800 shadow-2xl p-2 z-20 hidden md:block"
                    >
                        <div className="w-full h-full rounded-[24px] bg-white flex flex-col p-4 opacity-90">
                            <div className="flex gap-2 mb-4">
                                <div className="w-8 h-8 rounded-full bg-pink-500" />
                                <div className="w-full h-8 bg-gray-100 rounded-full" />
                            </div>
                            <div className="flex gap-2 mb-4 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-violet-500" />
                                <div className="w-24 h-8 bg-violet-100 rounded-full" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Feature List (60%) */}
                <div className="w-full lg:w-[60%]">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-12"
                    >
                        Available on <span className="text-pink-500">All Devices</span>
                    </motion.h2>

                    <div className="space-y-8 mb-10">
                        {features.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex gap-4"
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm">
                                    {item.icon}
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900">{item.title}</h4>
                                    <p className="text-gray-600 leading-relaxed mt-1">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link href="/register" className="inline-flex px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-gray-800 hover:scale-105 transition-all shadow-lg">
                            Add to Home Screen &rarr;
                        </Link>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
