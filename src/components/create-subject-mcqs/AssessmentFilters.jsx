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
    <div className="flex gap-4 w-full font-[var(--font-roboto-para)]">
      {/* Status Filter */}
      <Select>
        <SelectTrigger className="flex-1 min-w-0 h-10 font-[var(--font-monstrat-hadding)] cursor-pointer">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Active" className="cursor-pointer">
            Active
          </SelectItem>
          <SelectItem value="Draft" className="cursor-pointer">
            Draft
          </SelectItem>
        </SelectContent>
      </Select>

      {/* Course Filter */}
      <Select>
        <SelectTrigger className="flex-1 min-w-0 h-10 font-[var(--font-monstrat-hadding)] cursor-pointer">
          <SelectValue placeholder="Filter by Course" />
        </SelectTrigger>
        <SelectContent className="font-[var(--font-roboto-para)]">
          <SelectItem value="Clinical Pilates" className="cursor-pointer">
            Clinical Pilates
          </SelectItem>
          <SelectItem value="Rehab Training" className="cursor-pointer">
            Rehab Training
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
