"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { DashboardSection } from "@/components/dashboard/DashboardSection";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { saveEducation, deleteEducation, reorderEducation } from "@/app/actions";
import { PortfolioData } from "@/types/portfolio";
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

export function EducationSection({ 
  initialData
}: { 
  initialData: PortfolioData['education']
}) {
  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
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

      const updates = newItems.map((item, index) => ({
           id: item.id,
           order: index + 1
      }));

      startTransition(async () => {
           try {
               await reorderEducation(updates);
           } catch(error) {
               console.error(error);
               alert("Failed to reorder");
           }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      if (typeof value === "string") data[key] = value;
    });

    const finalData = {
      ...data,
      order: parseInt(data.order as string, 10),
    };

    startTransition(async () => {
      try {
        if (editingEducationId) {
          await saveEducation({ ...finalData, id: editingEducationId });
        } else {
          await saveEducation(finalData);
        }
        setIsAddingEducation(false);
        setEditingEducationId(null);
      } catch (error) {
        console.error(error);
        alert("Failed to save education");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this entry?")) return;
    startTransition(async () => {
      try {
        await deleteEducation(id);
      } catch (error) {
        console.error(error);
        alert("Failed to delete education");
      }
    });
  };

  if (!isMounted) return null;

  return (
    <DashboardSection number="06" title="Education History">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div /> 
        {!isAddingEducation && !editingEducationId && (
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2 bg-app-surface"
            onClick={() => setIsAddingEducation(true)}
          >
            <Plus size={16} />
            <span>New Entry</span>
          </Button>
        )}
      </div>

      {(isAddingEducation || editingEducationId) && (
        <Card className="mb-8 border-primary bg-primary/5">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <Input 
                name="institution" 
                label="Institution" 
                defaultValue={initialData.find(e => e.id === editingEducationId)?.institution || ""} 
                required 
              />
              <Input 
                name="degree" 
                label="Degree" 
                defaultValue={initialData.find(e => e.id === editingEducationId)?.degree || ""} 
                required 
              />
              <Input 
                name="field" 
                label="Field of Study" 
                defaultValue={initialData.find(e => e.id === editingEducationId)?.field || ""} 
                required 
              />
              <Input 
                name="duration" 
                label="Duration" 
                defaultValue={initialData.find(e => e.id === editingEducationId)?.duration || ""} 
                required 
              />
              <Input 
                name="order" 
                label="Order" 
                type="number" 
                defaultValue={initialData.find(e => e.id === editingEducationId)?.order ?? (items.length + 1)} 
                required 
              />

              <div className="md:col-span-2">
                <TextArea 
                  name="description" 
                  label="Description (Optional)" 
                  defaultValue={initialData.find(e => e.id === editingEducationId)?.description || ""} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 pt-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddingEducation(false);
                  setEditingEducationId(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isPending}>
                {isPending ? "Saving..." : (editingEducationId ? "Update Entry" : "Add Entry")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-6">
        <DndContext 
          id="education-dnd"
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
                    <div className="w-12 h-12 bg-app-bg border-2 border-app-border flex items-center justify-center font-mono font-bold text-app-muted shrink-0">
                      {item.order}
                    </div>
                    <div>
                      <h4 className="font-bold font-mono uppercase text-app-fg">{item.institution}</h4>
                      <p className="text-xs font-mono text-app-muted">{item.degree} in {item.field}</p>
                      <p className="text-xs font-mono text-app-muted">{item.duration}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => setEditingEducationId(item.id)}
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
            {items.length === 0 && !isAddingEducation && (
               <div className="text-center py-10 border-2 border-dashed border-app-border text-app-muted font-mono uppercase text-sm">
                 No education entries found
               </div>
            )}
          </SortableContext>
        </DndContext>
      </div>
    </DashboardSection>
  );
}
