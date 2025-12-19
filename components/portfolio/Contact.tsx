import React from "react";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

interface ContactProps {
  email?: string;
  github?: string;
  linkedin?: string;
}

export const Contact = ({
  email = "angga.ady@gmail.com",
  github,
  linkedin,
}: ContactProps) => {
  return (
    <Section id="contact" className="py-24 text-center bg-app-bg text-app-fg">
      <div className="flex flex-col items-center justify-center">
        <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-primary mb-6 animate-bounce" />
        <h2 className="font-mono text-3xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tighter mb-8 px-4">
          Let&apos;s Work<br />Together
        </h2>
        <p className="max-w-xl text-app-muted text-lg mb-10 font-sans">
          Have a project in mind or just want to discuss the latest in tech? 
          Drop me a line. I&apos;m always open to interesting conversations.
        </p>
        
        <Button variant="outline" size="lg" className="px-10 py-8 text-xl" href={`mailto:${email}`}>
          {email}
        </Button>

        <div className="mt-16 flex gap-8">
          {github && (
            <a href={`https://${github}`} target="_blank" rel="noopener noreferrer" className="text-app-muted hover:text-primary transition-colors">
              <Github size={28} />
            </a>
          )}
          {linkedin && (
            <a href={`https://${linkedin}`} target="_blank" rel="noopener noreferrer" className="text-app-muted hover:text-primary transition-colors">
              <Linkedin size={28} />
            </a>
          )}
        </div>
      </div>
    </Section>
  );
};
