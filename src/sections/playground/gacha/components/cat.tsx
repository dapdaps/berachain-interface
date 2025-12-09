"use client";

import { motion } from "framer-motion";

export function Cat1() {
    return (
        <motion.img
            src="/images/gacha/ball-1.png"
            alt="cat"
            className="w-[107px] absolute right-[10%] bottom-[145px] cursor-pointer"
            whileTap={{
                rotate: [0, -10, 10, -10, 10, 0],
                transition: {
                    duration: 0.5,
                    ease: "easeInOut"
                }
            }}
        />
    );
}

export function Cat2() {
    return (
        <motion.img
            src="/images/gacha/ball-2.png"
            alt="cat"
            className="w-[136px] absolute right-[35%] bottom-[20px] cursor-pointer"
            whileTap={{
                rotate: [0, -10, 10, -10, 10, 0],
                transition: {
                    duration: 0.5,
                    ease: "easeInOut"
                }
            }}
        />
    );
}
