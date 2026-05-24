"use client";

import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-sky-100 via-white to-blue-100">
            {/* Floating blobs */}
            <motion.div
                animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-20 left-20 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl"
            />

            <motion.div
                animate={{
                    y: [0, 20, 0],
                    x: [0, -10, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute bottom-20 right-20 h-52 w-52 rounded-full bg-cyan-300/20 blur-3xl"
            />

            {/* Cute bouncing dots */}
            <div className="flex items-end gap-3">
                {[0, 1, 2].map((item) => (
                    <motion.div
                        key={item}
                        animate={{
                            y: [0, -25, 0],
                            scale: [1, 1.15, 1],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: item * 0.15,
                        }}
                        className="h-6 w-6 rounded-full bg-gradient-to-b from-blue-400 to-blue-700 shadow-lg"
                    />
                ))}
            </div>

            {/* Cute face */}
            <motion.div
                animate={{
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                }}
                className="mt-8 flex flex-col items-center"
            >
                <div className="flex gap-6">
                    <div className="h-3 w-3 rounded-full bg-gray-700" />
                    <div className="h-3 w-3 rounded-full bg-gray-700" />
                </div>

                <motion.div
                    animate={{
                        width: [20, 30, 20],
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
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                }}
                className="mt-8 text-lg font-medium tracking-wide text-gray-700"
            >
                Memuat dashboard...
            </motion.p>

            {/* Progress line */}
            <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-blue-100">
                <motion.div
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600"
                />
            </div>
        </div>
    );
}