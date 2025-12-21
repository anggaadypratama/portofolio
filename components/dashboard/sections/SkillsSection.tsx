"use client";

import React, { useState, useTransition } from "react";
import { X } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { addSkill, deleteSkill } from "@/app/actions";
import { PortfolioData } from "@/types/portfolio";

export function SkillsSection({ initialData }: { initialData: PortfolioData['skills'] }) {
  const [newSkill, setNewSkill] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    startTransition(async () => {
      try {
        await addSkill(newSkill.trim());
        setNewSkill("");
      } catch (error) {
        console.error(error);
        alert("Failed to add skill");
      }
    });
  };

  const handleDeleteSkill = (id: string) => {
    startTransition(async () => {
      try {
        await deleteSkill(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete skill");
      }
    });
  };

  return (
    <DashboardSection number="04" title="Skill Set">
      <Card className="space-y-6">
        <div className="flex gap-2">
          <Input 
            placeholder="Add new skill (e.g. GraphQL)" 
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSkill();
            }}
          />
          <Button 
            variant="primary" 
            onClick={handleAddSkill}
            disabled={isPending}
          >
            {isPending ? "..." : "ADD"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {initialData.map((skill) => (
            <div 
              key={skill.id} 
              className="px-3 py-2 border-2 border-app-border bg-app-surface text-app-fg font-mono text-xs flex items-center gap-2 group hover:border-primary transition-colors"
            >
              {skill.name}
              <button 
                onClick={() => handleDeleteSkill(skill.id)}
                disabled={isPending}
                className="text-app-muted hover:text-red-500 transition-colors disabled:opacity-50"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </DashboardSection>
  );
}
