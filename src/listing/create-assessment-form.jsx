"use client";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "assessments";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  passingScore: z.number({ invalid_type_error: "Must be a number" }).min(1).max(100),
  questionLimit: z.number({ invalid_type_error: "Must be a number" }).min(1),
});

export default function CreateAssessmentForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const isEdit = location.state?.mode === "edit";
  const existing = location.state?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: existing?.title || "",
      subtitle: existing?.subtitle || "",
      description: existing?.description || "",
      passingScore: existing?.passingScore || 70,
      questionLimit: existing?.questionLimit || 10,
    },
  });

  const [shuffleQuestions, setShuffleQuestions] = useState(true);

  const handleSave = (statusType) => {
    return handleSubmit((data) => {
      const newEntry = {
        ...data,
        id: isEdit ? existing.id : Date.now(),
        avgScore: data.passingScore, 
        avgTimeSpent: isEdit ? existing.avgTimeSpent : "0 min",
        avgAttempts: isEdit ? existing.avgAttempts : 0,
        status: statusType,
        lastUpdated: new Date().toLocaleDateString(),
      };

      let prev = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

      if (isEdit) {
        prev = prev.map((item) => (item.id === newEntry.id ? newEntry : item));
      } else {
        prev.push(newEntry);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
      navigate("/listing");
    })();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Add Assessment</h2>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        {/* Subtitle */}
        <div className="space-y-1.5">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" {...register("subtitle")} />
          {errors.subtitle && <p className="text-sm text-destructive">{errors.subtitle.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Short Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        {/* Passing Score */}
        <div className="space-y-1.5">
          <Label htmlFor="passingScore">Passing Score (%)</Label>
          <Input type="number" id="passingScore" {...register("passingScore", { valueAsNumber: true })} />
          {errors.passingScore && <p className="text-sm text-destructive">{errors.passingScore.message}</p>}
        </div>

        {/* Shuffle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="shuffle">Shuffle Questions</Label>
          <Switch id="shuffle" checked={shuffleQuestions} onCheckedChange={setShuffleQuestions} />
        </div>

        {/* Question Limit */}
        <div className="space-y-1.5">
          <Label htmlFor="questionLimit">Question Limit</Label>
          <Input type="number" id="questionLimit" {...register("questionLimit", { valueAsNumber: true })} />
          {errors.questionLimit && <p className="text-sm text-destructive">{errors.questionLimit.message}</p>}
        </div>

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row gap-2">
          <Button className="w-full sm:w-1/2" onClick={() => handleSave("Active")}>
            ✔ Publish
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-1/2" onClick={() => handleSave("Draft")}>
            🗂 Save Draft
          </Button>
        </div>
      </form>
    </div>
  );
}
