"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { getExperiencePaginated } from "@/app/actions";

interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  projectName?: string | null;
  description: string;
  goal?: string;
  techStack: string[];
  imageUrl?: string | null;
  order: number;
}

interface ExperienceListProps {
  initialItems: ExperienceItem[];
  initialTotal: number;
  initialPage?: number;
}

export const ExperienceList = ({ initialItems, initialTotal, initialPage = 1 }: ExperienceListProps) => {
  const [displayedItems, setDisplayedItems] = useState<ExperienceItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialItems.length < initialTotal);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  // Load more items from server
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const result = await getExperiencePaginated(nextPage, 5);
      
      setDisplayedItems(prev => [...prev, ...result.items]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more experiences:", error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <Section id="experience" className="bg-app-bg text-app-fg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
        <div>
          <h3 className="font-mono text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-2">
            Experience_Log
          </h3>
          <p className="font-mono text-sm text-app-muted uppercase tracking-widest">
            Selected Projects & Roles
          </p>
        </div>
        <div className="hidden md:block w-32 h-px bg-app-border mb-4"></div>
      </div>

      <div className="space-y-12">
        {displayedItems.map((exp, idx) => {
          const isSkewLeft = idx % 2 === 0;
          const skewClass = isSkewLeft ? "transform -skew-x-12" : "transform skew-x-12";
          
          return (
            <div key={`${exp.order}-${idx}`} className="group relative">
              <div
                className={`absolute top-0 right-0 bg-app-fg text-app-bg px-4 py-1 font-mono text-xs font-bold uppercase -mt-4 mr-4 z-10 ${skewClass} group-hover:bg-primary group-hover:text-black transition-colors border border-app-border`}
              >
                {exp.duration}
              </div>
              <Card className="hover:border-primary transition-colors p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Content Section - 7 columns */}
                  <div className="lg:col-span-7 flex flex-col h-full">
                    <div>
                      <h4 className="text-2xl md:text-3xl font-bold font-mono uppercase tracking-tight">
                        {exp.projectName}
                      </h4>
                      <p className="text-primary font-bold mt-1 text-lg">
                        {exp.role}
                      </p>
                      {exp.projectName && (
                        <p className="text-sm text-app-muted mt-2 font-mono uppercase tracking-wide">
                         {exp.company}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 grow">
                      <p className="text-app-fg/90 mb-6 leading-relaxed">
                        {exp.description}
                      </p>
                      
                      {exp.goal && (
                        <div className="border-l-4 border-primary pl-6 py-4 bg-primary/10 mb-8 rounded-r-md">
                            <span className="block text-xs font-bold font-mono text-primary uppercase mb-2 tracking-widest">
                              Goal Achieved:
                            </span>
                            <p className="text-base text-app-fg italic font-medium leading-relaxed">
                              &quot;{exp.goal}&quot;
                            </p>
                        </div>
                      )}
                    </div>

                    {/* Tech Stack Skills */}
                    <div className="mt-auto pt-6 border-t border-dashed border-gray-300 dark:border-zinc-700">
                      <span className="block text-xs font-bold uppercase text-app-muted mb-3">
                        Tech Stack Used:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {exp.techStack.map((skill, skillIdx) => (
                          <span
                            key={skillIdx}
                            className="px-2 py-1 bg-app-surface text-app-fg text-xs font-mono border border-app-border"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Image Section - 5 columns */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="relative aspect-4/3 w-full border-2 border-app-border bg-app-surface overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                      {exp.imageUrl ? (
                        <Image
                          alt={`${exp.projectName || 'Project'} Documentation`}
                          className="object-cover object-center"
                          src={exp.imageUrl}
                          fill
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-app-muted uppercase">
                          No Preview Available
                        </div>
                      )}
                      <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
        
        {/* Intersection Observer Target */}
        {hasMore && (
          <div ref={observerRef} className="py-8 text-center">
            <div className="inline-block animate-pulse font-mono text-sm text-app-muted uppercase">
              Loading more...
            </div>
          </div>
        )}
        
        {!hasMore && displayedItems.length > 0 && (
          <div className="py-8 text-center font-mono text-sm text-app-muted uppercase">
            — End of Experience Log —
          </div>
        )}
      </div>
    </Section>
  );
};
