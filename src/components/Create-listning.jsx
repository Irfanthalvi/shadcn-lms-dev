"use client";

import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { X } from "lucide-react";

const Create = ({ open, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [shuffleQuestions, setShuffleQuestions] = useState(true);

  const handleFormSubmit = (data) => {
    const newAssessment = {
      title: data.title,
      subtitle: data.subtitle,
      shortDescription: data.description,
      passingScore: Number(data.passingScore),
      shuffle: shuffleQuestions,
      questionLimit: Number(data.questionLimit),
      avgScore: "70%",
      avgTimeSpent: "5m 20s",
      avgAttempts: "2",
      status: "Active",
      lastUpdated: new Date().toLocaleDateString(),
    };

    onSubmit(newAssessment);
    reset();
    setShuffleQuestions(true);
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="fixed right-0 top-0 h-screen w-full max-w-md border-l bg-background z-50 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add Assessment</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col justify-between h-full"
        >
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                placeholder="Enter subtitle"
                {...register("subtitle", { required: "Subtitle is required" })}
              />
              {errors.subtitle && (
                <p className="text-sm text-destructive">{errors.subtitle.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Short description</Label>
              <Textarea
                id="description"
                placeholder="Write a short description"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                type="number"
                id="passingScore"
                placeholder="e.g. 85"
                {...register("passingScore", {
                  required: "Passing score is required",
                  min: { value: 1, message: "Must be at least 1%" },
                  max: { value: 100, message: "Cannot exceed 100%" },
                })}
              />
              {errors.passingScore && (
                <p className="text-sm text-destructive">{errors.passingScore.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="shuffle">Shuffle the Questions</Label>
              <Switch
                id="shuffle"
                checked={shuffleQuestions}
                onCheckedChange={setShuffleQuestions}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="questionLimit">
                Set a Limit on the Number of Questions for Learner
              </Label>
              <Input
                type="number"
                id="questionLimit"
                placeholder="e.g. 10"
                {...register("questionLimit", {
                  required: "Question limit is required",
                  min: { value: 1, message: "At least 1 question required" },
                })}
              />
              {errors.questionLimit && (
                <p className="text-sm text-destructive">{errors.questionLimit.message}</p>
              )}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Save Draft
            </Button>
            <Button type="submit">Publish</Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default Create;
