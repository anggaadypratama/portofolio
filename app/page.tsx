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
  const [hero, about, experienceData, skills, tools, contact] = await Promise.all([
    prisma.heroSection.findFirst(),
    prisma.aboutSection.findFirst(),
    // Fetch first 5 experiences and total count for pagination
    Promise.all([
      prisma.experienceEntry.findMany({ 
        where: { isActive: true }, 
        orderBy: { order: 'asc' },
        take: 5,
      }),
      prisma.experienceEntry.count({ where: { isActive: true } }),
    ]),
    prisma.skill.findMany({ orderBy: { order: 'asc' } }),
    // Standardized to lowercase 'tool' model
    (prisma as any).tool?.findMany({ orderBy: { order: 'asc' } }) || [],
    prisma.contactInfo.findFirst(),
  ]);

  const [initialExperiences, totalExperiences] = experienceData;

  const marqueeItems = skills.length > 0 
    ? skills.map((s: { name: string }) => s.name)
    : [
      "Front-End Development",
      "Web3 Integration",
      "Game Development",
      "Artificial Intelligence",
      "Creative Coding",
    ];

  // Structured Data for SEO
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://anggaadypratama.com';
  
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Angga Ady Pratama',
    url: baseUrl,
    jobTitle: 'Web Developer',
    description: hero?.introParagraph || 'Web developer driven by curiosity and continuous learning.',
    email: contact?.primaryEmail,
    sameAs: [
      contact?.githubUrl,
      contact?.linkedinUrl,
    ].filter(Boolean),
    knowsAbout: skills.map((s: { name: string }) => s.name),
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Angga Ady Pratama Portfolio',
    url: baseUrl,
    description: 'Web developer driven by curiosity and continuous learning.',
    author: {
      '@type': 'Person',
      name: 'Angga Ady Pratama',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About',
        item: `${baseUrl}/#about`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Experience',
        item: `${baseUrl}/#experience`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Tech Stack',
        item: `${baseUrl}/#techstack`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Contact',
        item: `${baseUrl}/#contact`,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
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
        <ExperienceList 
          initialItems={initialExperiences} 
          initialTotal={totalExperiences}
          initialPage={1}
        />
        <TechStack items={skills} toolsItems={tools} />
        <Contact 
          email={contact?.primaryEmail}
          github={contact?.githubUrl}
          linkedin={contact?.linkedinUrl}
        />
        <Footer />
      </main>
    </>
  );
}
