export interface PortfolioData {
  hero: {
    preTitle?: string;
    headlineLine1?: string;
    headlineLine2?: string;
    introParagraph?: string;
  };
  about: {
    content?: string;
  };
  experience: {
    id: string;
    company: string;
    role: string;
    duration: string;
    projectName?: string;
    description: string;
    goal?: string;
    order: number;
    imageUrl?: string;
    techStack: string[];
    isActive: boolean;
  }[];
  skills: {
    id: string;
    name: string;
  }[];
  tools: {
    id: string;
    name: string;
  }[];
  contact: {
    primaryEmail?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };
}
