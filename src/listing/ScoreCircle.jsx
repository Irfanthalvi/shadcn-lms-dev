import React from "react";

const ScoreCircle = ({ score = 0 }) => {
  const dashArray = `${score}, 100`;

  return (
    <div className="w-10 h-10 relative flex items-center justify-center">
      <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
        <path
          className="text-muted-foreground"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="text-primary"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          d="M18 2.0845
             a 15.9155 15.9155 0 0 1 0 31.831
             a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <div className="absolute text-[13px] font-semibold text-foreground">
        {score}
      </div>
    </div>
  );
};

export default ScoreCircle;
