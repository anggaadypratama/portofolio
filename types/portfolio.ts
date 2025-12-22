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
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    duration: string;
    description: string | null;
    order: number;
  }[];
  contact: {
    primaryEmail?: string;
    githubUrl?: string;
    linkedinUrl?: string;
  };
}
