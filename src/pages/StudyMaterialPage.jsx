import React, { useState, useMemo } from "react";
import { useLms } from "@/context/LmsContext";
import {
  BookOpen,
  FileText,
  Download,
  Search,
  Layers,
  Sparkles,
  ExternalLink,
  Eye,
  Check,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function StudyMaterialPage() {
  const { studyMaterials, classes, isAdmin, userProfile } = useLms();
  const studentClassId = !isAdmin && userProfile?.classId ? String(userProfile.classId) : null;
  const [selectedClass, setSelectedClass] = useState(studentClassId || "all");
  const [search, setSearch] = useState("");
  const [previewMaterial, setPreviewMaterial] = useState(null);

  const activeClassId = studentClassId || selectedClass;

  const filteredMaterials = useMemo(() => {
    return (studyMaterials || []).filter((sm) => {
      const matchesClass =
        activeClassId === "all" || String(sm.classId) === String(activeClassId);
      const matchesSearch =
        sm.title.toLowerCase().includes(search.toLowerCase()) ||
        sm.subject.toLowerCase().includes(search.toLowerCase()) ||
        sm.type.toLowerCase().includes(search.toLowerCase());
      return matchesClass && matchesSearch;
    });
  }, [studyMaterials, activeClassId, search]);

  const handleDownload = (item) => {
    toast.success(`Downloading ${item.title} (${item.size || "PDF"})...`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
            Digital Learning Library
          </span>
          {studentClassId && userProfile?.className && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-secondary text-secondary-foreground border border-border">
              {userProfile.className} Only
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
          Study Materials, Notes & Solved Papers
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Curated textbook guides, chapter formula sheets, revision notes, and past solved board papers for Classes 8 to 12.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-card border border-border/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search study guides, notes, or subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        {/* Class Filter (Admin only or locked for student) */}
        {isAdmin ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none"
            >
              <option value="all">All Academic Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
            Enrolled: {userProfile?.className || "My Class"}
          </div>
        )}
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-16 bg-card border border-dashed border-border rounded-2xl p-8 space-y-3">
          <FileText className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No study materials found</h3>
          <p className="text-xs text-muted-foreground">
            {search ? "Try searching for a different keyword." : "Library is currently updating."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((sm) => (
            <div
              key={sm.id}
              className="group p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                    {sm.subject}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {sm.className || "Class 10"}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {sm.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="font-medium text-foreground">{sm.type}</span>
                    <span>•</span>
                    <span>{sm.size || "8.2 MB"}</span>
                    <span>•</span>
                    <span>{sm.downloads || 150}+ Downloads</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewMaterial(sm)}
                  className="text-xs font-semibold text-muted-foreground hover:text-foreground h-8"
                >
                  <Eye className="w-3.5 h-3.5 mr-1" /> Preview
                </Button>

                <Button
                  size="sm"
                  onClick={() => handleDownload(sm)}
                  className="gap-1.5 text-xs font-bold h-8 rounded-xl"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Material Document Preview Modal */}
      {previewMaterial && (
        <Dialog open={!!previewMaterial} onOpenChange={() => setPreviewMaterial(null)}>
          <DialogContent className="sm:max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                {previewMaterial.title}
              </DialogTitle>
            </DialogHeader>

            <div className="py-3 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <div>
                  <span className="text-muted-foreground">Subject & Class</span>
                  <div className="font-bold text-foreground">
                    {previewMaterial.subject} • {previewMaterial.className}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Format & Size</span>
                  <div className="font-bold text-foreground">
                    {previewMaterial.type} ({previewMaterial.size})
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2">
                <div className="font-bold text-foreground">Document Overview</div>
                <p className="text-muted-foreground leading-relaxed">
                  This learning packet includes comprehensive chapter theory, formula cheat sheets,
                  derivation breakdowns, solved numerical exercises, and high-yield examination tips.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setPreviewMaterial(null)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleDownload(previewMaterial);
                    setPreviewMaterial(null);
                  }}
                  className="gap-1.5 font-bold"
                >
                  <Download className="w-4 h-4" /> Download PDF Bundle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
