import { Input } from "@/components/ui/input";

const SearchInput = ({ value, onChange }) => {
  return (
    <Input
      placeholder="🔍 Search by name or keyword"
      className="md:w-1/2 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;
