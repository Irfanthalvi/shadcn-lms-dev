import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const AddBook = ({
  newBook,
  setNewBook,
  handleAddBook,
  openDialog,
  setOpenDialog,
  editingBookIndex,
}) => {
  const isEditing = editingBookIndex !== null;

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-md font-roboto-para">
        <DialogHeader>
          <DialogTitle className="font-monstrat-hadding text-left">
            {isEditing ? "Edit Book" : "Add Subject"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 pt-2">
          <Input
            placeholder="Enter Book Title"
            value={newBook}
            onChange={(e) => setNewBook(e.target.value)}
            className="font-roboto-para"
          />

          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setOpenDialog(false)}
              className="w-full sm:w-auto font-monstrat-hadding"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBook}
              className="w-full sm:w-auto font-monstrat-hadding"
            >
              {isEditing ? "Update" : "Add"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBook;
