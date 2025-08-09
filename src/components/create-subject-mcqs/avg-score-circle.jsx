import React from "react";

const AvgScoreCircle = ({ score = 75, size = 80 }) => {
  const radius = 15.9155;
  const dashArray = `${score}, 100`;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 36 36"
        className="w-full h-full rotate-[-90deg] text-primary"
      >
        <path
          className="text-muted-foreground"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          d={`
            M18 2.0845
            a ${radius} ${radius} 0 0 1 0 31.831
            a ${radius} ${radius} 0 0 1 0 -31.831
          `}
        />
        <path
          className="text-primary"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          d={`
            M18 2.0845
            a ${radius} ${radius} 0 0 1 0 31.831
            a ${radius} ${radius} 0 0 1 0 -31.831
          `}
        />
      </svg>
      <div className="absolute text-sm font-semibold text-foreground">
        {score}%
      </div>
    </div>
  );
};

export default AvgScoreCircle;
