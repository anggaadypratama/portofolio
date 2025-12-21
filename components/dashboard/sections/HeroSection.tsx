"use client";

import React, { useTransition } from "react";
import { Save } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { updateHero } from "@/app/actions";
import { PortfolioData } from "@/types/portfolio";

export function HeroSection({ initialData }: { initialData: PortfolioData['hero'] }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (formData: FormData) => {
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    startTransition(async () => {
      try {
        await updateHero(data);
        alert("HERO updated successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to update hero");
      }
    });
  };

  return (
    <DashboardSection number="01" title="Hero Section" active>
      <form action={handleUpdate}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <Input name="preTitle" label="Pre-Title Text" defaultValue={initialData.preTitle || ""} />
            <Input name="headlineLine1" label="Main Headline (Line 1)" defaultValue={initialData.headlineLine1 || ""} />
            <Input 
              name="headlineLine2"
              label="Main Headline (Line 2 - Highlight)" 
              defaultValue={initialData.headlineLine2 || ""}
              className="border-primary bg-primary/5"
            />
          </div>
          <TextArea 
            name="introParagraph"
            label="Intro Paragraph" 
            defaultValue={initialData.introParagraph || ""}
            className="h-57.5"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isPending} className="flex items-center gap-2">
            <Save size={16} /> 
            {isPending ? "SAVING..." : "Save Hero"}
          </Button>
        </div>
      </form>
    </DashboardSection>
  );
}
