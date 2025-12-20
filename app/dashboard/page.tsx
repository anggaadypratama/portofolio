"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit, X, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface PortfolioData {
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

const getFormData = (formData: FormData): Record<string, string | number | undefined | string[]> => {
  const data: Record<string, string | number | undefined | string[]> = {};
  formData.forEach((value, key) => {
    if (typeof value === "string") {
      data[key] = value;
    }
  });
  return data;
};

import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState("");
  const [newTool, setNewTool] = useState("");
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Fetch Portfolio Data
  const { data: portfolio, isLoading, error } = useQuery<PortfolioData>({
    queryKey: ["portfolio"],
    queryFn: async () => {
      const res = await fetch("/api/portfolio");
      if (!res.ok) throw new Error("Failed to fetch portfolio");
      return res.json();
    },
  });

  // Effect to sync selectedTech when editing
  React.useEffect(() => {
    if (editingExperienceId && portfolio) {
      const exp = portfolio.experience.find(e => e.id === editingExperienceId);
      setSelectedTech(exp?.techStack || []);
    } else if (isAddingExperience) {
      setSelectedTech([]);
    }
  }, [editingExperienceId, isAddingExperience, portfolio]);

  // Generic Mutation for Sections
  const updateSection = useMutation({
    mutationFn: async ({ section, data }: { section: string; data: Record<string, string | number | undefined | string[]> }) => {
      const res = await fetch(`/api/portfolio/${section}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Failed to update ${section}`);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      alert(`${variables.section.toUpperCase()} updated successfully!`);
    },
  });

  // Skill Mutations
  const addSkillMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/portfolio/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to add skill");
    },
    onSuccess: () => {
      setNewSkill("");
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const removeSkillMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/portfolio/skills/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove skill");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  // Tool Mutations
  const addToolMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch("/api/portfolio/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to add tool");
    },
    onSuccess: () => {
      setNewTool("");
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const removeToolMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/portfolio/tools/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove tool");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  // Experience Mutations
  const experienceMutation = useMutation({
    mutationFn: async (data: Record<string, string | number | undefined | string[]>) => {
      const res = await fetch("/api/portfolio/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update experience");
    },
    onSuccess: () => {
      setIsAddingExperience(false);
      setEditingExperienceId(null);
      setSelectedTech([]);
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const removeExperienceMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/portfolio/experience/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to remove experience");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
    },
  });

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'portfolio';

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image!');
      return null;
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="font-mono text-xl animate-pulse">LOADING_PORTFOLIO_DATA...</div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 font-mono">
        ERROR_LOADING_DATA: {error instanceof Error ? error.message : "UNKNOWN_ERROR"}
      </div>
    );
  }

  return (
    <>
      {/* 01. Hero Section */}
      <DashboardSection number="01" title="Hero Section" active>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          updateSection.mutate({ section: "hero", data: getFormData(formData) as any });
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <Input name="preTitle" label="Pre-Title Text" defaultValue={portfolio.hero.preTitle} />
              <Input name="headlineLine1" label="Main Headline (Line 1)" defaultValue={portfolio.hero.headlineLine1} />
              <Input 
                name="headlineLine2"
                label="Main Headline (Line 2 - Highlight)" 
                defaultValue={portfolio.hero.headlineLine2}
                className="border-primary bg-primary/5"
              />
            </div>
            <TextArea 
              name="introParagraph"
              label="Intro Paragraph" 
              defaultValue={portfolio.hero.introParagraph}
              className="h-57.5"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={updateSection.isPending} className="flex items-center gap-2">
              <Save size={16} /> 
              {updateSection.isPending ? "SAVING..." : "Save Hero"}
            </Button>
          </div>
        </form>
      </DashboardSection>

      {/* 02. About Me */}
      <DashboardSection number="02" title="About Me">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          updateSection.mutate({ section: "about", data: getFormData(formData) as any });
        }}>
          <Card className="dash-grid-bg p-0 overflow-hidden mb-6">
            <div className="p-4 flex justify-between items-center border-b-2 border-app-border bg-app-surface">
              <label className="font-mono font-bold text-app-fg text-xs uppercase tracking-widest">
                Biography Content
              </label>
            </div>
            <textarea 
              name="content"
              className="w-full bg-transparent border-none focus:ring-0 p-6 font-sans leading-relaxed min-h-40 resize-y text-app-fg"
              defaultValue={portfolio.about.content}
            />
          </Card>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={updateSection.isPending} className="flex items-center gap-2">
              <Save size={16} />
              {updateSection.isPending ? "SAVING..." : "Save About"}
            </Button>
          </div>
        </form>
      </DashboardSection>

      {/* 03. Experience Log */}
      <DashboardSection number="03" title="Experience Log">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div /> 
          {!isAddingExperience && !editingExperienceId && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-app-surface"
              onClick={() => setIsAddingExperience(true)}
            >
              <Plus size={16} />
              <span>New Entry</span>
            </Button>
          )}
        </div>

        {(isAddingExperience || editingExperienceId) && (
          <Card className="mb-8 border-primary bg-primary/5">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const data = getFormData(formData);
              
              const file = (e.currentTarget.elements.namedItem('imageFile') as HTMLInputElement)?.files?.[0];
              let imageUrLink = portfolio.experience.find(e => e.id === editingExperienceId)?.imageUrl;
              
              if (file) {
                const uploadedUrl = await handleUpload(file);
                if (uploadedUrl) imageUrLink = uploadedUrl;
              }

              const finalData = {
                ...data,
                imageUrl: imageUrLink,
                techStack: selectedTech,
                order: parseInt(data.order as string, 10), // Ensure order is a number
              };

              if (editingExperienceId) {
                experienceMutation.mutate({ ...finalData, id: editingExperienceId });
              } else {
                experienceMutation.mutate(finalData);
              }
            }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <Input name="company" label="Company" defaultValue={portfolio.experience.find(e => e.id === editingExperienceId)?.company} required />
                <Input name="role" label="Role" defaultValue={portfolio.experience.find(e => e.id === editingExperienceId)?.role} required />
                <Input name="projectName" label="Project Name" defaultValue={portfolio.experience.find(e => e.id === editingExperienceId)?.projectName || ""} />
                <Input name="duration" label="Duration" defaultValue={portfolio.experience.find(e => e.id === editingExperienceId)?.duration} required />
                <Input name="order" label="Order" type="number" defaultValue={portfolio.experience.find(e => e.id === editingExperienceId)?.order ?? (portfolio.experience.length + 1)} required />
                
                <div className="md:col-span-2">
                   <label className="block font-mono font-bold text-app-fg text-xs uppercase tracking-widest mb-2">Experience Image</label>
                   <div className="flex items-center gap-4">
                      {portfolio.experience.find(e => e.id === editingExperienceId)?.imageUrl && (
                        <div className="w-16 h-16 border-2 border-app-border overflow-hidden">
                          <img 
                            src={portfolio.experience.find(e => e.id === editingExperienceId)?.imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <input 
                        type="file" 
                        name="imageFile" 
                        accept="image/*"
                        className="bg-app-bg text-app-fg text-xs font-mono p-2 border-2 border-app-border w-full" 
                      />
                   </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block font-mono font-bold text-app-fg text-xs uppercase tracking-widest mb-3">Tech Stack (Skills & Tools)</label>
                  <div className="flex flex-wrap gap-2 p-3 border-2 border-app-border bg-app-bg/50 max-h-40 overflow-y-auto">
                    {[...portfolio.skills, ...portfolio.tools].sort((a, b) => a.name.localeCompare(b.name)).map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedTech(prev => 
                            prev.includes(item.name) 
                              ? prev.filter(s => s !== item.name) 
                              : [...prev, item.name]
                          );
                        }}
                        className={`px-2 py-1 text-[10px] font-mono border-2 transition-all ${
                          selectedTech.includes(item.name)
                            ? "bg-primary border-primary text-white"
                            : "border-app-border text-app-muted hover:border-primary"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                   <TextArea name="goal" label="Goal Achieved" defaultValue={portfolio.experience.find(e => e.id === editingExperienceId)?.goal || ""} />
                </div>

                <div className="md:col-span-2">
                  <TextArea name="description" label="Description" defaultValue={portfolio.experience.find(e => e.id === editingExperienceId)?.description} required />
                </div>
              </div>
              <div className="flex justify-end gap-3 p-6 pt-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingExperience(false);
                    setEditingExperienceId(null);
                    setSelectedTech([]);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={experienceMutation.isPending || uploading}>
                  {uploading ? "Uploading..." : (experienceMutation.isPending ? "Saving..." : (editingExperienceId ? "Update Entry" : "Add Entry"))}
                </Button>
              </div>
            </form>
          </Card>
        )}

        <div className="space-y-6">
          {portfolio.experience
            .sort((a, b) => a.order - b.order)
            .map((item) => (
            <div key={item.id} className="border-2 border-app-border bg-app-surface p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-app-fg/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-app-bg border-2 border-app-border flex items-center justify-center font-mono font-bold text-app-muted shrink-0 overflow-hidden">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.company} className="w-full h-full object-cover" />
                  ) : (
                    item.order
                  )}
                </div>
                <div>
                  <h4 className="font-bold font-mono uppercase text-app-fg">{item.company}</h4>
                  <p className="text-xs font-mono text-app-muted">{item.role} • {item.duration}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.techStack?.map(tech => (
                      <span key={tech} className="text-[9px] px-1 bg-app-fg/10 text-app-muted font-mono">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingExperienceId(item.id)}
                  className="p-2 border-2 border-app-border text-app-muted hover:text-primary hover:border-primary transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm("Are you sure you want to remove this entry?")) {
                      removeExperienceMutation.mutate(item.id);
                    }
                  }}
                  disabled={removeExperienceMutation.isPending}
                  className="p-2 border-2 border-app-border text-app-muted hover:text-red-500 hover:border-red-500 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {portfolio.experience.length === 0 && !isAddingExperience && (
             <div className="text-center py-10 border-2 border-dashed border-app-border text-app-muted font-mono uppercase text-sm">
               No experience entries found
             </div>
          )}
        </div>
      </DashboardSection>

      {/* 04. Skill Set */}
      <DashboardSection number="04" title="Skill Set">
        <Card className="space-y-6">
          <div className="flex gap-2">
            <Input 
              placeholder="Add new skill (e.g. GraphQL)" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newSkill.trim()) {
                  addSkillMutation.mutate(newSkill.trim());
                }
              }}
            />
            <Button 
              variant="primary" 
              onClick={() => newSkill.trim() && addSkillMutation.mutate(newSkill.trim())}
              disabled={addSkillMutation.isPending}
            >
              {addSkillMutation.isPending ? "..." : "ADD"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {portfolio.skills.map((skill) => (
              <div 
                key={skill.id} 
                className="px-3 py-2 border-2 border-app-border bg-app-surface text-app-fg font-mono text-xs flex items-center gap-2 group hover:border-primary transition-colors"
              >
                {skill.name}
                <button 
                  onClick={() => removeSkillMutation.mutate(skill.id)}
                  disabled={removeSkillMutation.isPending}
                  className="text-app-muted hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </DashboardSection>
      
      {/* 05. Tools & Core */}
      <DashboardSection number="05" title="Tools & Core">
        <Card className="space-y-6">
          <div className="flex gap-2">
            <Input 
              placeholder="Add new tool (e.g. Docker)" 
              value={newTool}
              onChange={(e) => setNewTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newTool.trim()) {
                  addToolMutation.mutate(newTool.trim());
                }
              }}
            />
            <Button 
              variant="primary" 
              onClick={() => newTool.trim() && addToolMutation.mutate(newTool.trim())}
              disabled={addToolMutation.isPending}
            >
              {addToolMutation.isPending ? "..." : "ADD"}
            </Button>
          </div>
          <div className="flex flex-wrap gap-3">
            {portfolio.tools?.map((tool) => (
              <div 
                key={tool.id} 
                className="px-3 py-2 border-2 border-app-border bg-app-surface text-app-fg font-mono text-xs flex items-center gap-2 group hover:border-primary transition-colors"
              >
                {tool.name}
                <button 
                  onClick={() => removeToolMutation.mutate(tool.id)}
                  disabled={removeToolMutation.isPending}
                  className="text-app-muted hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </DashboardSection>

      {/* 06. Contact Info */}
      <DashboardSection number="06" title="Contact Info" className="pb-20">
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          updateSection.mutate({ section: "contact", data: getFormData(formData) });
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <Input name="primaryEmail" label="Primary Email" defaultValue={portfolio.contact.primaryEmail} type="email" />
            <div className="space-y-4">
              <label className="block font-mono font-bold text-app-fg text-xs uppercase tracking-widest">Social Links</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-app-fg/5 border-2 border-r-0 border-app-border text-app-muted text-xs font-mono font-bold">GH</span>
                <Input name="githubUrl" defaultValue={portfolio.contact.githubUrl} className="border-l-0" />
              </div>
              <div className="flex">
                <span className="inline-flex items-center px-4 bg-app-fg/5 border-2 border-r-0 border-app-border text-app-muted text-xs font-mono font-bold">LI</span>
                <Input name="linkedinUrl" defaultValue={portfolio.contact.linkedinUrl} className="border-l-0" />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" disabled={updateSection.isPending} className="flex items-center gap-2">
              <Save size={16} /> 
              {updateSection.isPending ? "SAVING..." : "Save Contact"}
            </Button>
          </div>
        </form>
      </DashboardSection>
    </>
  );
}
