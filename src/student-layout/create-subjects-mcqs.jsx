import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { assessments as defaultAssessments } from "@/components/hard-code/table-mock-data";
import SearchInput from "@/components/create-subject-mcqs/search-input";
import AssessmentFilters from "@/components/create-subject-mcqs/AssessmentFilters";
import DataTable from "@/components/create-subject-mcqs/data-table";

const PER_PAGE = 5;

export default function Assessment() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState(defaultAssessments);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // ✅ delete handler
  const handleDelete = (id) => {
    setAssessments((prev) => prev.filter((item) => item.id !== id));
  };

  const filtered = assessments.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visible = filtered.slice(0, page * PER_PAGE);
  const hasMore = filtered.length > visible.length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          You have {filtered.length} assessments
        </p>
        <Button onClick={() => navigate("/assessment-page")}>
          + Add Assessment
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AssessmentFilters />
      </div>

      {/* ✅ delete callback pass karo */}
      <DataTable data={visible} onDelete={handleDelete} />

      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
            ↓ Load More
          </Button>
        </div>
      )}
    </div>
  );
}
