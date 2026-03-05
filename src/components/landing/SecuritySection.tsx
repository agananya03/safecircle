"use client";

import { motion } from "framer-motion";
import { Lock, EyeOff, Trash2, ShieldCheck } from "lucide-react";

const securityFeatures = [
    {
        icon: <Lock className="w-8 h-8 text-white" />,
        title: "End-to-End Encrypted",
        desc: "Your location and messages are cryptographically secured. Even we cannot read them."
    },
    {
        icon: <EyeOff className="w-8 h-8 text-white" />,
        title: "Invisible Mode",
        desc: "Send completely silent alerts with no visible UI notifications for ultimate discretion."
    },
    {
        icon: <Trash2 className="w-8 h-8 text-white" />,
        title: "Absolute Data Control",
        desc: "Export or permanently incinerate your account data at any time. You own your information."
    },
    {
        icon: <ShieldCheck className="w-8 h-8 text-white" />,
        title: "Trusted Circles Only",
        desc: "Zero public profiles. No stranger discovery. You define exactly who has access to your location."
    }
];

export function SecuritySection() {
    return (
        <section className="bg-gradient-to-br from-[#4c1d95] to-[#312e81] text-white py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-white"
                    >
                        Your Safety, Your Privacy
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {securityFeatures.map((feat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 lg:p-10 hover:bg-white/10 transition-colors"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center mb-6">
                                {feat.icon}
                            </div>
                            <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
                            <p className="text-white/70 text-lg leading-relaxed">{feat.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
