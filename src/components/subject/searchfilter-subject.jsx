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
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="w-full sm:w-56">
        <Input
          type="text"
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            w-full h-10 rounded-md
            border border-border 
            bg-background
            hover:border-border 
            active:border-border 
            focus-visible:ring-0 
            focus-visible:border-ring
            transition-none
          "
        />
      </div>

      {/* Filter Dropdown */}
      <div className="w-full sm:w-56">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger
            className="
              w-full h-10 rounded-md 
              border border-border 
              bg-background 
              hover:border-border 
              active:border-border 
              focus:ring-0 
              focus:border-ring
              transition-none 
              cursor-pointer
            "
          >
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All Subjects
            </SelectItem>
            {subjects.map((sub) => (
              <SelectItem
                key={sub.id}
                value={sub.label.toLowerCase()}
                className="cursor-pointer"
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
