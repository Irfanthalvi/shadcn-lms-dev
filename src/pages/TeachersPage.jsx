import React, { useState } from "react";
import { useLms } from "@/context/LmsContext";
import {
  Users,
  Search,
  Mail,
  Phone,
  BookOpen,
  Award,
  Star,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TeachersPage() {
  const { teachers } = useLms();
  const [search, setSearch] = useState("");

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase()) ||
      t.subjects.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="border-b border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
            Faculty & Instructors
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-1">
          Teachers & Faculty Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Academic instructors assigned across Classes 8 through 12.
        </p>
      </div>

      {/* Search Input */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search faculty by name, department, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Teachers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-card text-card-foreground border border-border rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div className="space-y-4">
              {/* Top Avatar & Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14 rounded-2xl border border-primary/20 bg-primary/10 text-primary font-bold text-lg flex items-center justify-center">
                  <AvatarFallback>{teacher.avatar}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-foreground truncate">
                      {teacher.name}
                    </h3>
                    <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{teacher.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-primary font-medium">{teacher.role}</p>
                  <p className="text-xs text-muted-foreground">{teacher.department}</p>
                </div>
              </div>

              {/* Subjects & Classes Tags */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                    Assigned Classes:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {teacher.assignedClasses.map((cls) => (
                      <Badge key={cls} variant="secondary" className="text-[11px]">
                        {cls}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase block mb-1">
                    Subjects Taught:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((sub) => (
                      <span
                        key={sub}
                        className="text-[11px] px-2 py-0.5 rounded bg-muted text-foreground border border-border/60"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Footer */}
            <div className="pt-4 border-t border-border space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 truncate">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>{teacher.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
