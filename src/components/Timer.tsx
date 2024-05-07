"use client";

import { timeFormatter, timestampCollector } from "@/helpers";
import { TodoWithChildren } from "@/types";
import { useState } from "react";
import { useInterval } from "react-use";

interface TimerProps {
  todo: TodoWithChildren;
}

export default function Timer({ todo }: TimerProps) {
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  useInterval(() => {
    setCurrentTimestamp(Date.now());
  }, 1000);

  const { totalTimestamp } = timestampCollector(todo, 0, currentTimestamp ?? 0);

  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full z-10">
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
      {currentTimestamp && (
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
        >
          {timeFormatter({ milliseconds: totalTimestamp })}
        </text>
      )}
    </svg>
  );
}
