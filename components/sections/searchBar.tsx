import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount: number;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  resultsCount,
  placeholder = "Search for Authors...",
}: SearchBarProps) => {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {resultsCount} result{resultsCount === 1 ? "" : "s"}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default SearchBar;
