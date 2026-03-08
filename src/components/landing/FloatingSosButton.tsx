"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function FloatingSosButton() {
    return (
        <Link href="/sos" className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 group">
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-[70px] h-[70px] rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-xl cursor-pointer"
            >
                {/* Pulsing ring background */}
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-40"></span>

                <AlertTriangle className="w-8 h-8 text-white relative z-10" strokeWidth={2.5} />
            </motion.div>
        </Link>
    );
}
