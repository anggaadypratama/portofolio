import React from "react";
import { Section } from "@/components/ui/Section";

interface AboutProps {
  content?: string;
}

export const About = ({ content }: AboutProps) => {
  return (
    <Section id="about" className="p-0 border-b-2 border-app-border">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 bg-primary p-6 md:p-16 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col justify-center">
          <h3 className="font-mono text-3xl md:text-5xl font-bold uppercase tracking-tighter text-black mb-4">
            About<br />The Dev
          </h3>
          <div className="w-16 h-2 bg-black mt-2"></div>
        </div>
        <div className="lg:col-span-8 p-6 md:p-16 flex flex-col justify-center bg-app-bg text-app-fg">
          <div className="max-w-none font-sans">
            {content ? (
              <p className="text-xl md:text-2xl font-light leading-relaxed mb-6 whitespace-pre-wrap">
                {content}
              </p>
            ) : (
              <>
                <p className="text-xl md:text-2xl font-light leading-relaxed mb-6">
                  Navigating the digital landscape with code as my compass.
                </p>
                <p className="text-app-muted mb-6 leading-relaxed">
                  With a deep-rooted passion for technology, I specialize in crafting robust front-end architectures that are both scalable and user-centric. My journey isn&apos;t just about writing code; it&apos;s about solving complex problems.
                </p>
                <p className="text-app-muted leading-relaxed">
                  Lately, I&apos;ve been diving deep into the <strong className="text-primary">Web3</strong> ecosystem, exploring decentralized applications, while also channeling my creativity into <strong className="text-primary">Game Development</strong>. My curiosity for <strong className="text-primary">Artificial Intelligence</strong> drives me to explore how AI can optimize development workflows and create smarter user interfaces.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};
