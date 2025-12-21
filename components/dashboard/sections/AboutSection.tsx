"use client";

import React, { useTransition } from "react";
import { Save } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { updateAbout } from "@/app/actions";
import { PortfolioData } from "@/types/portfolio";

export function AboutSection({ initialData }: { initialData: PortfolioData['about'] }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (formData: FormData) => {
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    startTransition(async () => {
      try {
        await updateAbout(data);
        alert("ABOUT updated successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to update about");
      }
    });
  };

  return (
    <DashboardSection number="02" title="About Me">
      <form action={handleUpdate}>
        <Card className="dash-grid-bg p-0 overflow-hidden mb-6">
          <div className="p-4 flex justify-between items-center border-b-2 border-app-border bg-app-surface">
            <label className="font-mono font-bold text-app-fg text-xs uppercase tracking-widest">
              Biography Content
            </label>
          </div>
          <textarea 
            name="content"
            className="w-full bg-transparent border-none focus:ring-0 p-6 font-sans leading-relaxed min-h-40 resize-y text-app-fg"
            defaultValue={initialData.content || ""}
          />
        </Card>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isPending} className="flex items-center gap-2">
            <Save size={16} />
            {isPending ? "SAVING..." : "Save About"}
          </Button>
        </div>
      </form>
    </DashboardSection>
  );
}
