"use client";

import { useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Plus, Trash, X } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

const CreateDrawer = ({ open, onClose, onSubmit }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "single",
      question: "",
      options: [
        { value: "", isCorrect: "no" },
        { value: "", isCorrect: "no" },
        { value: "", isCorrect: "no" },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onFormSubmit = (data) => {
    onSubmit(data);  // Call parent handler once
    reset();
    onClose();
  };

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent size='xl' className="fixed right-0 top-0 h-screen max-sm:!w-full border-l bg-background text-foreground z-50 shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Add Question</h2>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col justify-between h-full">
          <div className="p-6 space-y-6 overflow-y-auto">

            {/* Question Type */}
            <div>
              <Label>Question Type</Label>
              <RadioGroup
                defaultValue="single"
                onValueChange={(val) => setValue("type", val)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple">Multi Choice</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Question Input */}
            <div className="space-y-1.5">
              <Label htmlFor="question">Question</Label>
              <Textarea
                id="question"
                placeholder="Enter your question"
                {...register("question", { required: "Question is required" })}
              />
              {errors.question && (
                <p className="text-sm text-destructive">{errors.question.message}</p>
              )}
            </div>

            {/* Dynamic Options */}
            <div className="space-y-2">
              <Label>Option</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Enter option"
                    {...register(`options.${index}.value`, { required: true })}
                  />
                  <div className="flex items-center gap-1 text-sm">
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        value="yes"
                        {...register(`options.${index}.isCorrect`)}
                        className="accent-primary"
                      />
                      Yes
                    </label>
                    <label className="flex items-center gap-1">
                      <input
                        type="radio"
                        value="no"
                        {...register(`options.${index}.isCorrect`)}
                        className="accent-primary"
                      />
                      No
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ value: "", isCorrect: "no" })}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add More
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 px-6 py-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Submit
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateDrawer;
