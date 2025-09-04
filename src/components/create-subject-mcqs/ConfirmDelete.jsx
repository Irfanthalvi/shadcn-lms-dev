"use client";

import { Trash2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DeleteConfirm = ({ type, onConfirm }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (onConfirm) onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger icon (Trash2) */}
      <DialogTrigger asChild>
        <Trash2
          className="size-4 text-destructive cursor-pointer "
          onClick={(e) => {
            e.stopPropagation(); // prevent parent click
            setOpen(true);
          }}
        />
      </DialogTrigger>

      {/* Confirmation Modal */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            Delete {type === "chapter" ? "Chapter" : "Book"}?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. The{" "}
            {type === "chapter" ? "chapter" : "book"} will be permanently
            deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirm;
