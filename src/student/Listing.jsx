import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SearchInput from "@/listing/SearchInput";
import DataTable from "@/listing/DataTable";
import AssessmentFilters from "@/listing/AssessmentFilters";

const STORAGE_KEY = "assessments";
const PER_PAGE = 5;

export default function Listing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    setAssessments(stored);
  }, []);

  const handleEdit = (item) => {
    navigate("/assessmentpage", {
      state: { mode: "edit", data: item },
    });
  };

  const handleDelete = (id) => {
    const updated = assessments.filter((a) => a.id !== id);
    setAssessments(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
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
        <Button onClick={() => navigate("/assessmentpage")}>+ Add Assessment</Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <AssessmentFilters />
      </div>

      <DataTable data={visible} onEdit={handleEdit} onDelete={handleDelete} />

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
