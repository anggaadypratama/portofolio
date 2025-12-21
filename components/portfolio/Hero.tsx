"use client";

import React from "react";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { motion } from "framer-motion";

interface HeroProps {
  preTitle?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  introParagraph?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
} as any;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as any;

const headlineVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
} as any;

export const Hero = ({
  preTitle = "Hello_World",
  headlineLine1 = "I AM ANGGA",
  headlineLine2 = "ADY PRATAMA",
  introParagraph = "I am a web developer driven by curiosity and continuous learning, dedicated to creating impactful and maintainable web solutions.",
}: HeroProps) => {
  return (
    <Section className="min-h-[85vh] flex flex-col justify-center pt-32 pb-20">
      <div className="absolute -right-20 top-20 opacity-5 select-none pointer-events-none hidden lg:block text-app-fg">
        <span className="text-[20rem] font-mono font-bold leading-none">
          DEV
        </span>
      </div>

      <motion.div
        className="max-w-4xl relative z-10 text-app-fg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          className="font-mono text-primary font-bold text-lg mb-4 tracking-widest uppercase"
          variants={itemVariants}
        >
          {preTitle}
        </motion.p>
        
        <motion.h2
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 tracking-tighter uppercase break-words"
          variants={headlineVariants}
        >
          {headlineLine1} <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r dark:bg-linear-to-r bg-primary">
            {headlineLine2}
          </span>
        </motion.h2>
        
        <motion.p
          className="text-xl md:text-2xl max-w-2xl leading-relaxed text-app-muted font-light border-l-4 border-primary pl-6 mb-12"
          variants={itemVariants}
        >
          {introParagraph}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6"
          variants={itemVariants}
        >
          <Button variant="primary" size="lg" className="group" href="#contact">
            CONTACT ME
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            href="/api/generate-cv" 
            target="_blank"
          >
            DOWNLOAD RESUME
            <Download className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </Section>
  );
};
