"use client";

import React, { useTransition } from "react";
import { Save } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { updateContact } from "@/app/actions";
import { PortfolioData } from "@/types/portfolio";

export function ContactSection({ initialData }: { initialData: PortfolioData['contact'] }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (formData: FormData) => {
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    startTransition(async () => {
      try {
        await updateContact(data);
        alert("CONTACT updated successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to update contact");
      }
    });
  };

  return (
    <DashboardSection number="06" title="Contact Info" className="pb-20">
      <form action={handleUpdate}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <Input name="primaryEmail" label="Primary Email" defaultValue={initialData.primaryEmail || ""} type="email" />
          <div className="space-y-4">
            <label className="block font-mono font-bold text-app-fg text-xs uppercase tracking-widest">Social Links</label>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-app-fg/5 border-2 border-r-0 border-app-border text-app-muted text-xs font-mono font-bold">GH</span>
              <Input name="githubUrl" defaultValue={initialData.githubUrl || ""} className="border-l-0" />
            </div>
            <div className="flex">
              <span className="inline-flex items-center px-4 bg-app-fg/5 border-2 border-r-0 border-app-border text-app-muted text-xs font-mono font-bold">LI</span>
              <Input name="linkedinUrl" defaultValue={initialData.linkedinUrl || ""} className="border-l-0" />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant="primary" disabled={isPending} className="flex items-center gap-2">
            <Save size={16} /> 
            {isPending ? "SAVING..." : "Save Contact"}
          </Button>
        </div>
      </form>
    </DashboardSection>
  );
}
