// /listing/AssessmentFilters.jsx

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AssessmentFilters() {
  return (
    <div className="flex gap-4">
      <Select>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Draft">Draft</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Filter by Course" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Clinical Pilates">Clinical Pilates</SelectItem>
          <SelectItem value="Rehab Training">Rehab Training</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
