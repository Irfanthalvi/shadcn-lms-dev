import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { loadQuestions } from "@/components/questions";
import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { toast } from "sonner";

const ChapterAssessment = () => {
  const { subject, chapterId } = useParams(); // e.g. /assessment/english/chapter1
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const topRef = useRef(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const q = await loadQuestions(subject, chapterId);
      if (!q) {
        toast.error("❌ No questions found for this chapter");
        return;
      }
      setQuestions(q);
      setAnswers(Array(q.length).fill(null));
      setLoading(false);
    };

    fetchQuestions();
  }, [subject, chapterId]);

  const handleOptionChange = (qIndex, option) => {
    if (!submitted) {
      const updated = [...answers];
      updated[qIndex] = option;
      setAnswers(updated);
    }
  };

  const handleSubmit = () => {
    if (answers.includes(null)) {
      toast.warning("❗ Answer all questions before submitting");
      return;
    }

    const correctCount = answers.reduce((count, answer, index) => {
      return answer === questions[index].correct ? count + 1 : count;
    }, 0);

    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;

    const score = ((correctCount / questions.length) * 100).toFixed(0);

    setSubmitted(true);
    setResult({
      score,
      correct: correctCount,
      incorrect: questions.length - correctCount,
      attempts: 1,
      timeTaken: `${minutes}m ${seconds}s`,
      passed: score >= 60,
    });

    setTimeout(() => {
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-primary">
        <Loader className="animate-spin w-10 h-10 mb-2" />
        <span className="text-xl">Loading Assessment...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 space-y-6">
      <div ref={topRef}></div>

      {submitted && result && (
        <div className="p-6 rounded-xl space-y-4 border border-border">
          <h2 className="text-xl font-semibold text-destructive">🎉 Well Done!</h2>
          <p className="text-muted-foreground">
            You completed the assessment for <strong>{subject} {chapterId}</strong>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Score</p>
              <p className="text-lg font-semibold">{result.score}%</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`text-lg font-semibold ${result.passed ? "text-primary" : "text-destructive"}`}>
                {result.passed ? "Passed" : "Failed"}
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Attempts</p>
              <p className="text-lg font-semibold">1</p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">Time Taken</p>
              <p className="text-lg font-semibold">{result.timeTaken}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-left capitalize">{subject} {chapterId.replace("chapter", "Chapter ")}</h1>
        <p className="text-left text-sm text-muted-foreground">📝 35 Marks &nbsp;&nbsp; ⏱ 35 Minutes</p>
      </div>

      <div className="space-y-6">
        {questions.map((question, qIndex) => {
          const userAnswer = answers[qIndex];
          const isCorrect = userAnswer === question.correct;

          return (
            <div key={qIndex} className="space-y-3">
              <div className="flex justify-between items-start">
                <h2 className="text-base font-medium">
                  {qIndex + 1}. {question.text}
                </h2>
                {submitted && (
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    isCorrect
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}>
                    {isCorrect ? "Correct ✅" : "Wrong ❌"}
                  </span>
                )}
              </div>

              <RadioGroup
                value={userAnswer || ""}
                onValueChange={(value) => handleOptionChange(qIndex, value)}
                className="space-y-2"
              >
                {question.options.map((option, oIndex) => {
                  const isSelected = userAnswer === option;
                  const isCorrect = question.correct === option;
                  const isUserCorrect = isSelected && isCorrect;
                  const isUserIncorrect = isSelected && !isCorrect;
                  const isMissedCorrect = !isSelected && isCorrect;

                  let labelClass =
                    "flex items-center gap-3 p-3 border rounded-xl text-sm cursor-pointer transition";

                  if (submitted) {
                    if (isUserCorrect) {
                      labelClass += " bg-green-100 border-green-500 text-green-800";
                    } else if (isUserIncorrect) {
                      labelClass += " bg-red-100 border-red-500 text-red-800";
                    } else if (isMissedCorrect) {
                      labelClass += " bg-yellow-100 border-yellow-500 text-yellow-800";
                    } else {
                      labelClass += " border-border";
                    }
                  } else {
                    labelClass += " hover:border-primary border-border";
                  }

                  return (
                    <label key={oIndex} className={labelClass}>
                      <RadioGroupItem value={option} />
                      <span className="w-full">{option}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div className="text-right">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
};

export default ChapterAssessment;
