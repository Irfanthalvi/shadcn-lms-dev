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

const questions = [
  {
    id: 1,
    question: "Which of the following is the capital of Pakistan?",
    type: "single", // single choice = RadioGroup
    options: [
      { value: "Karachi" },
      { value: "Islamabad" },
      { value: "Lahore" },
      { value: "Quetta" },
    ],
  },
  {
    id: 2,
    question: "Which of the following are programming languages?",
    type: "multiple", // multiple choice = Checkbox
    options: [
      { value: "Python" },
      { value: "HTML" },
      { value: "Java" },
      { value: "CSS" },
    ],
  },
  {
    id: 3,
    question: "Select the correct answer: 2 + 2 = ?",
    type: "single",
    options: [{ value: "3" }, { value: "4" }, { value: "5" }],
  },
  {
    id: 4,
    question: "Which of the following are fruits?",
    type: "multiple",
    options: [
      { value: "Apple" },
      { value: "Carrot" },
      { value: "Banana" },
      { value: "Potato" },
    ],
  },
];

const QuestionDrawer = ({ open, onClose }) => {
  return (
    <Drawer open={open} onOpenChange={onClose} direction="right">
      <DrawerContent size="xl" className="p-6">
        {/* Header */}
        <div className="flex justify-between">
          <DrawerHeader className="p-0">
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </div>

        <div className="space-y-8 mt-6">
          {/* Assessment Title & Description */}
          <ScrollArea className="h-[calc(100vh-100px)] -mr-6 pr-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Final Assessment
              </h1>
              <h2 className="text-lg sm:text-xl font-semibold mt-2">
                Treatment Modalities &amp; Basic Principles
              </h2>
              <p className="text-gray-600 mt-2 max-w-prose">
                Test your understanding of the core principles and techniques
                covered in this module. This assessment consists of
                multiple-choice and single-choice questions designed to evaluate
                your knowledge.
              </p>
            </div>

            {/* Questions */}
            {questions.map((q, index) => (
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
                          className="flex flex-wrap items-center gap-3 w-full cursor-pointer border rounded-lg px-4 py-2 hover:bg-gray-50"
                        >
                          <RadioGroupItem
                            value={opt.value}
                            id={`q${q.id}-opt${i}`}
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
                          className="flex flex-wrap items-center gap-3 w-full cursor-pointer border rounded-lg px-4 py-2 hover:bg-gray-50"
                        >
                          <Checkbox id={`q${q.id}-opt${i}`} />
                          <span className="text-base break-words">
                            {opt.value}
                          </span>
                        </label>
                      ))}
                      <p className="text-sm text-gray-500 mt-1 uppercase font-medium">
                        Select all that apply
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default QuestionDrawer;
