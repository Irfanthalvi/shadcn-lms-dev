import { Badge } from "@/components/ui/badge";

const StatusBadge = ({ status = "Draft" }) => {
  const isActive = status.toLowerCase() === "active";

  return (
    <Badge
      variant="outline"
      className={`px-2 py-0.5 text-xs font-medium rounded-md border ${
        isActive ? "border-green-600 text-green-700" : "border-muted text-muted-foreground"
      }`}
    >
      <span
        className={`inline-block w-2 h-2 mr-1 rounded-full ${
          isActive ? "bg-green-500" : "bg-muted-foreground"
        }`}
      />
      {status}
    </Badge>
  );
};

export default StatusBadge;
