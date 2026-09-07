import React, { useState, useMemo } from "react";
import { useLms } from "@/context/LmsContext";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  Plus,
  Calendar,
  AlertCircle,
  Megaphone,
  Trash2,
  Search,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement } = useLms();
  const { isAdmin } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    category: "Academic",
    priority: "Important",
    content: "",
  });

  const categories = ["all", "Exams", "Academic", "Meeting", "Event"];

  const filteredAnnouncements = useMemo(() => {
    return (announcements || []).filter((ann) => {
      const matchCat =
        selectedCategory === "all" ||
        ann.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        ann.title.toLowerCase().includes(search.toLowerCase()) ||
        ann.content.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [announcements, selectedCategory, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    addAnnouncement(formData);
    setFormData({
      title: "",
      category: "Academic",
      priority: "Important",
      content: "",
    });
    setModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
              Notice Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground mt-1">
            Official Announcements & Notices
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Examination date sheets, curriculum revisions, holiday notices, and institutional circulars.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setModalOpen(true)}
            className="gap-2 shadow-sm font-bold text-xs h-9 rounded-xl"
          >
            <Plus className="w-4 h-4" />
            Post Announcement
          </Button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search circulars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl capitalize transition-all shrink-0 ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Announcements List */}
      {filteredAnnouncements.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card border border-dashed border-border rounded-2xl space-y-3">
          <Bell className="w-12 h-12 text-muted-foreground/60 mx-auto" />
          <h3 className="text-base font-bold text-foreground">No circulars found</h3>
          <p className="text-xs text-muted-foreground">
            {search ? "No announcements matching your search query." : "Notice board is currently clear."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="bg-card text-card-foreground border border-border/80 rounded-2xl p-5 hover:border-primary/40 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      ann.priority === "Urgent"
                        ? "bg-destructive/10 text-destructive border border-destructive/20"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}
                  >
                    {ann.priority}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                    {ann.category}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.date}
                  </span>
                  {isAdmin && (
                    <button
                      onClick={() => deleteAnnouncement(ann.id)}
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <h2 className="text-lg font-bold text-foreground">{ann.title}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Admin Post Announcement Modal */}
      {isAdmin && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Post New Announcement</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="ann-title">Title *</Label>
                <Input
                  id="ann-title"
                  placeholder="e.g. Midterm Examination Schedule"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ann-cat">Category</Label>
                  <select
                    id="ann-cat"
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Exams">Exams</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="ann-priority">Priority</Label>
                  <select
                    id="ann-priority"
                    value={formData.priority}
                    onChange={(e) => setFormData((p) => ({ ...p, priority: e.target.value }))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ann-content">Notice Content *</Label>
                <Textarea
                  id="ann-content"
                  rows={4}
                  placeholder="Details of the announcement..."
                  value={formData.content}
                  onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Publish Circular</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
