import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  Bell,
  Plus,
  Calendar,
  AlertCircle,
  Megaphone,
  X,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function AnnouncementsPage() {
  const { announcements, addAnnouncement } = useLms();
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "Academic",
    priority: "Important",
    content: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.warning("Please fill in Announcement Title and Content");
      return;
    }
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
              Notice Board
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
            School Announcements & Circulars
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official notices, exam schedules, holiday notifications, and academic circulars.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} className="gap-2 shadow-sm font-semibold">
          <Plus className="h-4 w-4" />
          Post New Announcement
        </Button>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    ann.priority === "Urgent"
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }`}
                >
                  {ann.priority}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {ann.category}
                </span>
              </div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {ann.date}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground">{ann.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ann.content}
            </p>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card text-card-foreground border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
              <h2 className="text-lg font-bold">Post New Announcement</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setModalOpen(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="annTitle">Title *</Label>
                <Input
                  id="annTitle"
                  placeholder="e.g. Schedule for Mid-Term Exams"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="annCategory">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) =>
                      setFormData((p) => ({ ...p, category: val }))
                    }
                  >
                    <SelectTrigger id="annCategory">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Exams">Exams</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Meeting">Meeting</SelectItem>
                      <SelectItem value="Holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="annPriority">Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(val) =>
                      setFormData((p) => ({ ...p, priority: val }))
                    }
                  >
                    <SelectTrigger id="annPriority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent Alert</SelectItem>
                      <SelectItem value="Important">Important Notice</SelectItem>
                      <SelectItem value="General">General Circular</SelectItem>
                      <SelectItem value="Event">Event News</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="annContent">Detailed Notice Content *</Label>
                <Textarea
                  id="annContent"
                  rows={4}
                  placeholder="Write announcement details..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, content: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Publish Circular</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
