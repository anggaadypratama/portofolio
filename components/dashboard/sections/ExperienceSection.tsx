"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { saveExperience, deleteExperience, reorderExperience } from "@/app/actions";
import { PortfolioData } from "@/types/portfolio";
import { supabase } from "@/lib/supabase";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "../SortableItem";

export function ExperienceSection({ 
  initialData, 
  availableSkills, 
  availableTools 
}: { 
  initialData: PortfolioData['experience'],
  availableSkills: PortfolioData['skills'],
  availableTools: PortfolioData['tools']
}) {
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState(initialData.sort((a, b) => a.order - b.order));

  React.useEffect(() => {
    setItems(initialData.sort((a, b) => a.order - b.order));
  }, [initialData]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 8,
        }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Hydration fix
  const [isMounted, setIsMounted] = useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // Prepare optimistic update for server
      const updates = newItems.map((item, index) => ({
           id: item.id,
           order: index + 1
      }));

      startTransition(async () => {
           try {
               await reorderExperience(updates);
           } catch(error) {
               console.error(error);
               alert("Failed to reorder");
           }
      });
    }
  };

  // Effect to sync selectedTech when editing
  React.useEffect(() => {
    if (editingExperienceId && initialData) {
      const exp = initialData.find(e => e.id === editingExperienceId);
      setSelectedTech(exp?.techStack || []);
    } else if (isAddingExperience) {
      setSelectedTech([]);
    }
  }, [editingExperienceId, isAddingExperience, initialData]);

  // ... (keep helper functions same) ...

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") data[key] = value;
    });
    
    const file = (e.currentTarget.elements.namedItem('imageFile') as HTMLInputElement)?.files?.[0];
    let imageUrLink = initialData.find(e => e.id === editingExperienceId)?.imageUrl;
    
    if (file) {
      const uploadedUrl = await handleUpload(file);
      if (uploadedUrl) imageUrLink = uploadedUrl;
    }

    const finalData = {
      ...data,
      imageUrl: imageUrLink,
      techStack: selectedTech,
      order: parseInt(data.order as string, 10),
    };

    startTransition(async () => {
      try {
        if (editingExperienceId) {
          await saveExperience({ ...finalData, id: editingExperienceId });
        } else {
          await saveExperience(finalData);
        }
        setIsAddingExperience(false);
        setEditingExperienceId(null);
        setSelectedTech([]);
      } catch (error) {
        console.error(error);
        alert("Failed to save experience");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this entry?")) return;
    startTransition(async () => {
      try {
        await deleteExperience(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete experience");
      }
    });
  };

  if (!isMounted) return null;

  return (
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
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <Input name="company" label="Company" defaultValue={initialData.find(e => e.id === editingExperienceId)?.company || ""} required />
              <Input name="role" label="Role" defaultValue={initialData.find(e => e.id === editingExperienceId)?.role || ""} required />
              <Input name="projectName" label="Project Name" defaultValue={initialData.find(e => e.id === editingExperienceId)?.projectName || ""} />
              <Input name="duration" label="Duration" defaultValue={initialData.find(e => e.id === editingExperienceId)?.duration || ""} required />
              <Input name="order" label="Order" type="number" defaultValue={initialData.find(e => e.id === editingExperienceId)?.order ?? (items.length + 1)} required />
              
              <div className="md:col-span-2">
                 <label className="block font-mono font-bold text-app-fg text-xs uppercase tracking-widest mb-2">Experience Image</label>
                 <div className="flex items-center gap-4">
                    {initialData.find(e => e.id === editingExperienceId)?.imageUrl && (
                      <div className="w-16 h-16 border-2 border-app-border overflow-hidden">
                        <img 
                          src={initialData.find(e => e.id === editingExperienceId)?.imageUrl} 
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
                  {[...availableSkills, ...availableTools].sort((a, b) => a.name.localeCompare(b.name)).map(item => (
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
                 <TextArea name="goal" label="Goal Achieved" defaultValue={initialData.find(e => e.id === editingExperienceId)?.goal || ""} />
              </div>

              <div className="md:col-span-2">
                <TextArea name="description" label="Description" defaultValue={initialData.find(e => e.id === editingExperienceId)?.description || ""} required />
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
              <Button type="submit" variant="primary" disabled={isPending || uploading}>
                {uploading ? "Uploading..." : (isPending ? "Saving..." : (editingExperienceId ? "Update Entry" : "Add Entry"))}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-6">
        <DndContext 
          id="experience-dnd"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={items.map(item => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="border-2 border-app-border bg-app-surface p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-app-fg/5 transition-colors cursor-move">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-app-bg border-2 border-app-border flex items-center justify-center font-mono font-bold text-app-muted shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.company} className="w-full h-full object-cover" />
                      ) : (
                        item.order
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold font-mono uppercase text-app-fg">{item.projectName}</h4>
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
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setEditingExperienceId(item.id)}
                      className="p-2 border-2 border-app-border text-app-muted hover:text-primary hover:border-primary transition-colors cursor-pointer"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                      className="p-2 border-2 border-app-border text-app-muted hover:text-red-500 hover:border-red-500 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </SortableItem>
            ))}
            {items.length === 0 && !isAddingExperience && (
               <div className="text-center py-10 border-2 border-dashed border-app-border text-app-muted font-mono uppercase text-sm">
                 No experience entries found
               </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </DashboardSection>
  );
}
