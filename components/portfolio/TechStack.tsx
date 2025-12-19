import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Section";

interface TechItem {
  id: string;
  name: string;
}

interface TechStackProps {
  items?: TechItem[];
  toolsItems?: TechItem[];
}

const defaultTechStack = [
  "JavaScript (ES6+)",
  "TypeScript",
  "React.js",
  "Next.js",
  "Tailwind CSS",
  "Node.js",
  "Solidity",
  "Web3.js",
  "Three.js",
];

const defaultTools = [
  "Git / GitHub",
  "Figma / UI Design",
  "Agile / Scrum",
  "Performance Optimization",
  "Technical Writing",
];

export const TechStack = ({ items, toolsItems }: TechStackProps) => {
  const displayTech = items && items.length > 0 ? items.map(i => i.name) : defaultTechStack;
  const displayTools = toolsItems && toolsItems.length > 0 ? toolsItems.map(i => i.name) : defaultTools;

  return (
    <Section id="skills" className="p-0 border-b-2 border-app-border">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-6 md:p-20 border-b-2 md:border-b-0 md:border-r-2 border-app-border bg-app-bg text-app-fg">
          <h3 className="font-mono text-3xl md:text-4xl font-bold uppercase mb-8">Tech Stack</h3>
          <div className="flex flex-wrap gap-3">
            {displayTech.map((tech) => (
              <Badge key={tech} className="px-4 py-2 text-sm hover:bg-primary hover:border-primary transition-colors cursor-default">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
        <div className="p-6 md:p-20 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#EAB308_1px,transparent_1px)] bg-size-[16px_16px]"></div>
          <h3 className="font-mono text-4xl font-bold uppercase mb-8 text-primary relative z-10">
            Tools & Core
          </h3>
          <ul className="space-y-4 font-mono text-lg relative z-10">
            {displayTools.map((tool) => (
              <li key={tool} className="flex items-center gap-3 group">
                <span className="w-2 h-2 bg-primary group-hover:scale-150 transition-transform"></span>
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
};
