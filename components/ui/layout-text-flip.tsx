"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const LayoutTextFlip = ({
  text = "Build Amazing",
  words = ["Landing Pages", "Component Blocks", "Page Sections", "3D Shaders"],
  duration = 3000,
}: {
  text: string;
  words: string[];
  duration?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, duration);
    return () => clearInterval(interval);
  }, [words.length, duration]);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-center">
      <span className="text-2xl md:text-4xl font-bold tracking-tight text-white leading-tight">
        {text}
      </span>
      <span className="relative inline-flex items-center justify-center w-fit overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] px-4 py-1.5 text-2xl md:text-4xl font-bold tracking-tight text-sky-400">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="inline-block whitespace-nowrap pt-0.5"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
};
