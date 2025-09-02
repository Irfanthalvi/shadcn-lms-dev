import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import ScoreCircle from "@/components/create-subject-mcqs/score-circle";
import StatusBadge from "@/components/create-subject-mcqs/status-badge";
import { useNavigate } from "react-router-dom";

export default function DataTable({ data = [], onDelete }) {
  const navigate = useNavigate();

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate("/assessment-page");
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    onDelete?.(id); // ✅ parent ko call
  };

  const handleRowClick = (id) => {
    navigate("/assessment-page");
  };

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[900px]">
        <TableHeader>
          <TableRow>
            {[
              "Title",
              "Avg. Score",
              "Avg. Time Spent",
              "Avg. Attempts",
              "Status",
              "Last Updated",
              "Actions",
            ].map((head) => (
              <TableHead key={head}>
                <div className="flex items-center gap-1 font-monstrat-hadding">
                  {head}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-10 text-muted-foreground"
              >
                <div className="flex flex-col items-center justify-center space-y-6">
                  <img
                    src="/data-not-found.svg"
                    alt="No data"
                    className="w-48 h-48 object-contain"
                  />
                  <h1 className="text-2xl font-bold">No Data Found</h1>
                  <p className="text-base text-muted-foreground">
                    Sorry, no assessments were found for your criteria.
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((a) => (
              <TableRow
                key={a.id}
                onClick={() => handleRowClick(a.id)}
                className="cursor-pointer"
              >
                <TableCell>
                  <div className="font-medium font-monstrat-hadding">
                    {a.title}
                  </div>
                  <div className="text-sm text-muted-foreground font-roboto-para">
                    {a.subtitle}
                  </div>
                </TableCell>
                <TableCell>
                  <ScoreCircle score={a.avgScore} />
                </TableCell>
                <TableCell>{a.avgTimeSpent}</TableCell>
                <TableCell>{a.avgAttempts}</TableCell>
                <TableCell>
                  <StatusBadge status={a.status} />
                </TableCell>
                <TableCell>{a.lastUpdated}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleEdit(a.id, e)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(a.id, e)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
