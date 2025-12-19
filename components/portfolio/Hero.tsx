"use client";

import React from "react";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";

interface HeroProps {
  preTitle?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  introParagraph?: string;
}

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

      <div className="max-w-4xl relative z-10 text-app-fg">
        <p className="font-mono text-primary font-bold text-lg mb-4 tracking-widest uppercase">
          {preTitle}
        </p>
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-8 tracking-tighter uppercase break-words">
          {headlineLine1} <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r dark:bg-linear-to-r  bg-primary">
          {headlineLine2}
          </span>
        </h2>
        <p className="text-xl md:text-2xl max-w-2xl leading-relaxed text-app-muted font-light border-l-4 border-primary pl-6 mb-12">
          {introParagraph}
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
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
        </div>
      </div>
    </Section>
  );
};
