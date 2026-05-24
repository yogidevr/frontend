"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-white to-blue-100">
            {/* Background blobs */}
            <motion.div
                animate={{
                    y: [0, -25, 0],
                    x: [0, 15, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute left-10 top-20 h-44 w-44 rounded-full bg-blue-300/20 blur-3xl"
            />

            <motion.div
                animate={{
                    y: [0, 25, 0],
                    x: [0, -15, 0],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-16 right-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl"
            />

            {/* Jumping bubbles */}
            <div className="flex items-end gap-3">
                {[0, 1, 2].map((bubble) => (
                    <motion.div
                        key={bubble}
                        animate={{
                            y: [0, -22, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: bubble * 0.18,
                        }}
                        className="h-6 w-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-700 shadow-lg"
                    />
                ))}
            </div>

            {/* Cute smile */}
            <motion.div
                animate={{
                    rotate: [0, 4, -4, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                }}
                className="mt-8 flex flex-col items-center"
            >
                <div className="flex gap-5">
                    <div className="h-3 w-3 rounded-full bg-gray-700" />
                    <div className="h-3 w-3 rounded-full bg-gray-700" />
                </div>

                <motion.div
                    animate={{
                        width: [18, 28, 18],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                    className="mt-3 h-2 rounded-full bg-gray-700"
                />
            </motion.div>

            {/* Text */}
            <motion.p
                animate={{
                    opacity: [0.4, 1, 0.4],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                }}
                className="mt-8 text-sm font-medium tracking-wide text-gray-700"
            >
                Memuat halaman...
            </motion.p>

            {/* Animated progress */}
            <div className="mt-5 h-2 w-60 overflow-hidden rounded-full bg-blue-100">
                <motion.div
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                />
            </div>
        </div>
    );
}