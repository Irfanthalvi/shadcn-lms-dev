import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import Create from "@/components/Create-listning";

const PER_PAGE = 5;

const Listing = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [assessments, setAssessments] = useState([
    {
      title: "Treatment Modalities & Basic Principles",
      subtitle: "Module-End Quiz",
      avgScore: 93,
      avgTimeSpent: "5m",
      avgAttempts: 1,
      status: "Active",
      lastUpdated: "Apr 15, 2025",
    },
    {
      title: "Treatment Modalities & Basic Principles",
      subtitle: "Final Comprehensive Assessment",
      avgScore: 67,
      avgTimeSpent: "12m",
      avgAttempts: 1,
      status: "Active",
      lastUpdated: "Apr 14, 2025",
    },
    {
      title: "Physiotherapy Fundamentals",
      subtitle: "Final Comprehensive Assessment",
      avgScore: 29,
      avgTimeSpent: "6m",
      avgAttempts: 1,
      status: "Active",
      lastUpdated: "Apr 13, 2025",
    },
    {
      title: "Rehab & Conditioning Training",
      subtitle: "Exercise Selection Quiz",
      avgScore: 73,
      avgTimeSpent: "12m",
      avgAttempts: 2,
      status: "Active",
      lastUpdated: "Apr 12, 2025",
    },
    {
      title: "Rehab & Conditioning Training",
      subtitle: "Final Assessment",
      avgScore: 35,
      avgTimeSpent: "3m",
      avgAttempts: 2,
      status: "Active",
      lastUpdated: "Apr 11, 2025",
    },
    {
      title: "Clinical Pilates Principles",
      subtitle: "Principles & Alignment Quiz",
      avgScore: 90,
      avgTimeSpent: "10m",
      avgAttempts: 1,
      status: "Active",
      lastUpdated: "Apr 10, 2025",
    },
    {
      title: "Clinical Pilates Principles",
      subtitle: "Final Assessment",
      avgScore: 93,
      avgTimeSpent: "15m",
      avgAttempts: 1,
      status: "Active",
      lastUpdated: "Apr 9, 2025",
    },
  ]);

  const handleAddAssessment = (newAssessment) => {
    setAssessments((prev) => [newAssessment, ...prev]);
  };

  const filtered = assessments.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const visible = filtered.slice(0, page * PER_PAGE);
  const hasMore = filtered.length > visible.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            You have {filtered.length} active assessments
          </p>
        </div>
        <Button onClick={() => setDrawerOpen(true)}>+ Add Assessment</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <Input
          placeholder="Search by name or keyword"
          className="md:w-1/2 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by Course Association" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pilates">Clinical Pilates</SelectItem>
              <SelectItem value="rehab">Rehab Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[900px] border-0">
          <TableHeader>
            <TableRow>
              {["Title", "Avg. Score", "Avg. Time Spent", "Avg. Attempts", "Status", "Last Updated", "Actions"].map((head) => (
                <TableHead key={head}>
                  <div className="flex items-center gap-1">
                    {head}
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No assessments yet. Click "Add Assessment" to get started.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="font-medium">{a.title}</div>
                    <div className="text-sm text-muted-foreground">{a.subtitle}</div>
                  </TableCell>
                  <TableCell>
                    <div className="relative w-9 h-9">
                      <svg viewBox="0 0 36 36" className="w-full h-full text-primary">
                        <path
                          className="text-muted-foreground"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${a.avgScore}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                        {a.avgScore}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{a.avgTimeSpent}</TableCell>
                  <TableCell>{a.avgAttempts}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${a.status === "Active" ? "bg-green-500" : "bg-gray-400"}`} />
                      <span className="text-sm">{a.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{a.lastUpdated}</TableCell>
                  <TableCell className="space-x-2">
                        <Button variant="ghost" size="icon">👁️</Button>
                        <Button variant="ghost" size="icon">✏️</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
            ↓ Load More
          </Button>
        </div>
      )}

      {/* Create Form Drawer */}
      <Create open={drawerOpen} onClose={() => setDrawerOpen(false)} onSubmit={handleAddAssessment} />
    </div>
  );
};

export default Listing;
