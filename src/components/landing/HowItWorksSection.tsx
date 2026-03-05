"use client";

import { motion } from "framer-motion";
import { UserPlus, MapPinned, ShieldCheck } from "lucide-react";

const steps = [
    {
        num: "1",
        icon: <UserPlus className="w-10 h-10 text-pink-500" />,
        title: "Create Your Circle",
        description: "Invite your trusted friends, family, and neighbors to join your safety network."
    },
    {
        num: "2",
        icon: <MapPinned className="w-10 h-10 text-violet-500" />,
        title: "Stay Connected",
        description: "Share your location during journeys, set check-ins, and stay updated with your circle."
    },
    {
        num: "3",
        icon: <ShieldCheck className="w-10 h-10 text-rose-500" />,
        title: "Get Help Instantly",
        description: "One tap sends alerts to everyone. Your circle can see your location and respond immediately."
    }
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-extrabold text-gray-900"
                    >
                        Safety in Three Simple Steps
                    </motion.h2>
                </div>

                <div className="relative">
                    {/* Dotted connecting line (desktop only) */}
                    <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-gray-200 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 text-white text-2xl font-bold flex items-center justify-center shadow-lg mb-8 relative group-hover:scale-110 transition-transform">
                                    {/* Pulse ring */}
                                    <div className="absolute inset-0 rounded-full border border-pink-500 animate-ping opacity-20" />
                                    {step.num}
                                </div>
                                <div className="bg-gray-50 w-24 h-24 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:-translate-y-2 transition-transform">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed max-w-[280px]">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
