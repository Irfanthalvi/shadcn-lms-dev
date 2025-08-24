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

const SearchFilterChapter = ({
  search,
  setSearch,
  filter,
  setFilter,
  chapters,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      {/* Search Input */}
      <div className="w-full sm:w-72">
        <Input
          type="text"
          placeholder="Search chapters..."
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

      {/* Filter Dropdown (All chapters) */}
      <div className="w-full sm:w-72">
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
            <SelectValue placeholder="Filter by chapter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="cursor-pointer">
              All Chapters
            </SelectItem>
            {chapters.map((ch, idx) => (
              <SelectItem
                className="cursor-pointer"
                key={idx}
                value={ch.title.toLowerCase()}
              >
                {ch.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SearchFilterChapter;
