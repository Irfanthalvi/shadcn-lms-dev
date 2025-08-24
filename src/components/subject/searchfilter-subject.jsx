"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SearchFilterSubject = ({
  search,
  setSearch,
  filter,
  setFilter,
  subjects,
}) => {
  return (
    <div className=" w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Search Input (same size as filter) */}
      <div className="w-full sm:w-56">
        <Input
          type="text"
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full "
        />
      </div>

      {/* Filter Dropdown (same size as search) */}
      <div className="w-full sm:w-56">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className={"cursor-pointer"}>
              All Subjects
            </SelectItem>
            {subjects.map((sub) => (
              <SelectItem
                className={"cursor-pointer"}
                key={sub.id}
                value={sub.label.toLowerCase()}
              >
                {sub.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchFilterSubject;
