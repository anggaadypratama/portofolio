"use client";

import React, { useState, useTransition } from "react";
import { X } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { addTool, deleteTool } from "@/app/actions";
import { PortfolioData } from "@/types/portfolio";

export function ToolsSection({ initialData }: { initialData: PortfolioData['tools'] }) {
  const [newTool, setNewTool] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddTool = () => {
    if (!newTool.trim()) return;
    startTransition(async () => {
      try {
        await addTool(newTool.trim());
        setNewTool("");
      } catch (error) {
        console.error(error);
        alert("Failed to add tool");
      }
    });
  };

  const handleDeleteTool = (id: string) => {
    startTransition(async () => {
      try {
        await deleteTool(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete tool");
      }
    });
  };

  return (
    <DashboardSection number="05" title="Tools & Core">
      <Card className="space-y-6">
        <div className="flex gap-2">
          <Input 
            placeholder="Add new tool (e.g. Docker)" 
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTool();
            }}
          />
          <Button 
            variant="primary" 
            onClick={handleAddTool}
            disabled={isPending}
          >
            {isPending ? "..." : "ADD"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          {initialData?.map((tool) => (
            <div 
              key={tool.id} 
              className="px-3 py-2 border-2 border-app-border bg-app-surface text-app-fg font-mono text-xs flex items-center gap-2 group hover:border-primary transition-colors"
            >
              {tool.name}
              <button 
                onClick={() => handleDeleteTool(tool.id)}
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
