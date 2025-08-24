"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "../ui/scroll-area";

const QuestionDrawer = ({ open, onClose, chapter }) => {
  if (!chapter) return null;

  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent className="w-full sm:w-[480px] md:w-[600px] lg:w-[720px] xl:w-[sm] max-w-full p-4 sm:p-6">
        {/* Header */}
        <div className="flex justify-between">
          <DrawerHeader className="p-0">
            <DrawerTitle>{chapter.title || "Assessment Preview"}</DrawerTitle>
            <DrawerDescription>
              Review all questions added in this chapter before finalizing.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </div>

        {/* Body */}
        {/* Body */}
        <div className="space-y-8 mt-6">
          <ScrollArea className="h-[calc(100vh-100px)] -mr-6 pr-6">
            <div className="space-y-8 pb-20">
              {/* Questions */}
              {chapter.questions?.length > 0 ? (
                chapter.questions.map((q, index) => (
                  <div key={q.id} className="space-y-3">
                    {/* Question */}
                    <p className="font-semibold text-base sm:text-lg">
                      {index + 1}. {q.question}
                    </p>

                    {/* Options */}
                    <div className="space-y-2">
                      {q.type === "single" ? (
                        <RadioGroup>
                          {q.options.map((opt, i) => (
                            <label
                              key={i}
                              htmlFor={`q${q.id}-opt${i}`}
                              className="flex flex-wrap items-center gap-3 w-full border rounded-lg px-4 py-2 "
                            >
                              <RadioGroupItem
                                value={opt.value}
                                id={`q${q.id}-opt${i}`}
                                disabled
                                className="pointer-events-none"
                              />
                              <span className="text-base break-words">
                                {opt.value}
                              </span>
                            </label>
                          ))}
                        </RadioGroup>
                      ) : (
                        <>
                          {q.options.map((opt, i) => (
                            <label
                              key={i}
                              htmlFor={`q${q.id}-opt${i}`}
                              className="flex flex-wrap items-center gap-3 w-full border rounded-lg px-4 py-2"
                            >
                              <Checkbox
                                id={`q${q.id}-opt${i}`}
                                disabled
                                className="pointer-events-none"
                              />
                              <span className="text-base break-words">
                                {opt.value}
                              </span>
                            </label>
                          ))}
                          <p className="text-sm mt-1 uppercase font-medium">
                            Select all that apply
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground italic mt-4">
                  No questions added in this chapter yet.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QuestionDrawer;
