import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  BookOpen,
  FileText,
  Download,
  Search,
  Layers,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function StudyMaterialPage() {
  const { studyMaterials, classes } = useLms();
  const [selectedClass, setSelectedClass] = useState("all");
  const [search, setSearch] = useState("");

  const filteredMaterials = studyMaterials.filter((sm) => {
    const matchesClass =
      selectedClass === "all" || String(sm.classId) === String(selectedClass);
    const matchesSearch =
      sm.title.toLowerCase().includes(search.toLowerCase()) ||
      sm.subject.toLowerCase().includes(search.toLowerCase());
    return matchesClass && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
            Digital Learning Library
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
          Study Material, Notes & Solved Papers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Curated textbook guides, chapter formulas, lecture notes, and past 10-year board paper bundles for Classes 8 to 12.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search study guides, notes, or subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Class Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs w-full sm:w-auto">
          <button
            onClick={() => setSelectedClass("all")}
            className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
              selectedClass === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Classes
          </button>
          {classes.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedClass(String(c.id))}
              className={`px-3 py-1 rounded-full font-medium transition whitespace-nowrap ${
                selectedClass === String(c.id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Study Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((item) => (
          <div
            key={item.id}
            className="bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {item.className}
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  {item.size}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/60 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-xs text-muted-foreground font-semibold">
                    {item.subject}
                  </span>
                  <div className="text-xs text-foreground font-medium truncate">
                    {item.type}
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-base text-foreground leading-snug">
                {item.title}
              </h3>
            </div>

            <div className="pt-4 border-t border-border space-y-3 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{item.downloads} Downloads</span>
                <span>Updated {item.updated}</span>
              </div>

              <Button
                variant="default"
                size="sm"
                className="w-full text-xs font-semibold h-9 shadow-sm"
                onClick={() =>
                  toast.success(`Downloading "${item.title}" (${item.size})...`)
                }
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download Study Resource
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
