"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

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
  }, []);

  return (
    // CAMBIO: gap más pequeño y alineación centrada
    <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-center">
      
      {/* Texto Fijo: Reducido de text-6xl a text-4xl para que quepa en una línea */}
      <motion.span
        layoutId="subtext"
        className="text-2xl md:text-4xl font-bold tracking-tight text-white drop-shadow-sm leading-tight"
      >
        {text}
      </motion.span>

      {/* Caja del Texto: Más compacta (px-4 py-2) y fuente alineada (text-4xl) */}
      <motion.span
        layout
        className="relative inline-flex items-center justify-center w-fit overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-1.5 font-sans text-2xl md:text-4xl font-bold tracking-tight text-sky-400 shadow-lg shadow-sky-500/10"
      >
        <AnimatePresence mode="popLayout">
          <motion.span
            key={currentIndex}
            initial={{ y: -30, filter: "blur(5px)", opacity: 0 }}
            animate={{
              y: 0,
              filter: "blur(0px)",
              opacity: 1,
            }}
            exit={{ y: 30, filter: "blur(5px)", opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className={cn("inline-block whitespace-nowrap pt-1")}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </div>
  );
};