import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="relative w-full md:w-1/3">
      {/* Icon */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />

      {/* Shadcn Input */}
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-9 h-10 rounded-md border border-border focus-visible:ring-1 focus-visible:ring-ring"
      />
    </div>
  );
};

export default SearchInput;
