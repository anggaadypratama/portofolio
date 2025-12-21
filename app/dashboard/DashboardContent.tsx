"use client";

import React from "react";
import { PortfolioData } from "@/types/portfolio";
import { HeroSection } from "@/components/dashboard/sections/HeroSection";
import { AboutSection } from "@/components/dashboard/sections/AboutSection";
import { ExperienceSection } from "@/components/dashboard/sections/ExperienceSection";
import { SkillsSection } from "@/components/dashboard/sections/SkillsSection";
import { ToolsSection } from "@/components/dashboard/sections/ToolsSection";
import { ContactSection } from "@/components/dashboard/sections/ContactSection";

export default function DashboardContent({ portfolio }: { portfolio: PortfolioData }) {
  return (
    <>
      <HeroSection initialData={portfolio.hero} />
      <AboutSection initialData={portfolio.about} />
      <ExperienceSection 
        initialData={portfolio.experience} 
        availableSkills={portfolio.skills} 
        availableTools={portfolio.tools} 
      />
      <SkillsSection initialData={portfolio.skills} />
      <ToolsSection initialData={portfolio.tools} />
      <ContactSection initialData={portfolio.contact} />
    </>
  );
}
