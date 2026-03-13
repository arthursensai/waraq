import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search for Authors..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">0 results</InputGroupAddon>
    </InputGroup>
  );
};

export default SearchBar;
