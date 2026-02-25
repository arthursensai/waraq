"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";
import { LibraryFilters } from "@/types/interfaces";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LibraryToolbarProps {
  filters: LibraryFilters;
  setFilters: Dispatch<SetStateAction<LibraryFilters>>;
}

const LibraryToolbar = ({ filters, setFilters }: LibraryToolbarProps) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex gap-4 justify-between">
        <InputGroup className="flex-1">
          <InputGroupInput placeholder="Search for documents..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">0 results</InputGroupAddon>
        </InputGroup>
        <Button
          size="icon-lg"
          variant="outline"
          onClick={() => setShowFilters(showFilters == true ? false : true)}
        >
          <SlidersHorizontal />
        </Button>
      </div>
      <div
        className={`${showFilters ? "flex" : "hidden"} w-full bg-card p-3 rounded-lg`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Open <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuCheckboxItem>
                Arabic
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>
                English
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LibraryToolbar;
