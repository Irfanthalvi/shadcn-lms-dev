// AddChapter.jsx
import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const chapterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  desc: z.string().optional(),
  time: z.string().min(1, "Estimated time is required"),
});

const AddChapter = ({
  chapterDialog,
  setChapterDialog,
  chapterData,
  setChapterData,
  handleAddChapter,
}) => {
  const isEditing = chapterData?.title?.length > 0;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      desc: "",
      time: "",
    },
  });

  useEffect(() => {
    if (chapterDialog && chapterData) {
      reset({
        title: chapterData.title || "",
        desc: chapterData.desc || "",
        time: chapterData.time || "",
      });
    }
  }, [chapterDialog, chapterData, reset]);

  const onSubmit = (data) => {
    handleAddChapter(data);
    reset();
  };

  const handleClose = () => {
    reset();
    setChapterDialog(false);
    setChapterData({ title: "", desc: "", time: "" });
  };

  return (
    <Dialog open={chapterDialog} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditing ? "Edit Chapter" : "Add Chapter"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Chapter Title</Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter chapter title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="desc">Short Description</Label>
            <Textarea
              id="desc"
              rows={3}
              {...register("desc")}
              placeholder="Summary of the chapter"
            />
            {errors.desc && (
              <p className="text-sm text-destructive">{errors.desc.message}</p>
            )}
          </div>

          {/* Time */}
          <div className="grid gap-2">
            <Label htmlFor="time">Estimated Learning Time</Label>
            <Input id="time" {...register("time")} placeholder="e.g. 2 hours" />
            {errors.time && (
              <p className="text-sm text-destructive">{errors.time.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Update" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddChapter;
