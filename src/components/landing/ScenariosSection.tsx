"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const scenarios = [
    {
        title: "Walking Home Alone",
        imageGrad: "from-indigo-400 to-cyan-400",
        features: [
            "Journey tracking active",
            "Live location shared",
            "Voice activation ready",
            "One-tap SOS accessible"
        ]
    },
    {
        title: "Uncomfortable Date",
        imageGrad: "from-rose-400 to-orange-400",
        features: [
            "Fake call scheduled",
            "Check-in timer set",
            "Quick exit ready",
            "Circle on standby"
        ]
    },
    {
        title: "Daily Commute",
        imageGrad: "from-emerald-400 to-teal-400",
        features: [
            "Route tracking",
            "ETA sharing",
            "Auto-alerts enabled",
            "Emergency contacts ready"
        ]
    }
];

export function ScenariosSection() {
    return (
        <section className="bg-[#fdf2f8] py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900"
                    >
                        Real Situations, Real Protection
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {scenarios.map((scenario, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                        >
                            <div className={`h-48 w-full bg-gradient-to-br ${scenario.imageGrad} opacity-80 flex items-center justify-center`}>
                                {/* Abstract image placeholder */}
                                <div className="w-24 h-24 rounded-full bg-white/20 blur-xl" />
                                <div className="absolute font-black tracking-widest text-white/40 uppercase text-2xl rotate-[-10deg]">
                                    Scenario {index + 1}
                                </div>
                            </div>

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">{scenario.title}</h3>
                                <ul className="space-y-4">
                                    {scenario.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-center gap-3 text-gray-600 font-medium">
                                            <div className="w-5 h-5 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-pink-600" strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
