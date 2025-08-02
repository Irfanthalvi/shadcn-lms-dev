import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import ScoreCircle from "@/listing/score-circle";
import StatusBadge from "@/listing/status-badge";
import { Button } from "@/components/ui/button";

export default function DataTable({ data = [] }) {
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
              "Actions", // keep action column
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
            data.map((a, idx) => (
              <TableRow key={a.id || idx}>
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
                <TableCell className="space-x-2">
                  <Button variant="ghost" size="icon">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="w-4 h-4" />
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
