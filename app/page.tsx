import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Marquee } from "@/components/ui/Marquee";
import { About } from "@/components/portfolio/About";
import { ExperienceList } from "@/components/portfolio/ExperienceList";
import { TechStack } from "@/components/portfolio/TechStack";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [hero, about, experience, skills, tools, contact] = await Promise.all([
    prisma.heroSection.findFirst(),
    prisma.aboutSection.findFirst(),
    prisma.experienceEntry.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    // Standardized to lowercase 'tool' model
    (prisma as any).tool?.findMany({ orderBy: { order: 'asc' } }) || [],
    prisma.contactInfo.findFirst(),
  ]);

  const marqueeItems = skills.length > 0 
    ? skills.map((s: { name: string }) => s.name)
    : [
      "Front-End Development",
      "Web3 Integration",
      "Game Development",
      "Artificial Intelligence",
      "Creative Coding",
    ];

  return (
    <main className="min-h-screen bg-app-bg text-app-fg transition-colors duration-300">
      <Navbar />
      <Hero 
        preTitle={hero?.preTitle}
        headlineLine1={hero?.headlineLine1}
        headlineLine2={hero?.headlineLine2}
        introParagraph={hero?.introParagraph}
      />
      <Marquee items={marqueeItems} />
      <About content={about?.content} />
      <ExperienceList items={experience} />
      <TechStack items={skills} toolsItems={tools} />
      <Contact 
        email={contact?.primaryEmail}
        github={contact?.githubUrl}
        linkedin={contact?.linkedinUrl}
      />
      <Footer />
    </main>
  );
}
