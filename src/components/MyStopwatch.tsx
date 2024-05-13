"use client";

import React, { useEffect, useState } from "react";
import TimerStyled from "./TimerStyled";
import { useInterval } from "react-use";
import { timestampCollector } from "@/helpers";
import { TodoWithChildren } from "@/types";
import TodoActions from "./TodoActions";
import { CircleRightIcon } from "./icons";
import { Button } from "@nextui-org/react";

export default function MyStopwatch({ todos }: { todos: TodoWithChildren[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const index = todos.findIndex((todo) => todo.status === "in-progress");
    if (index !== -1) {
      setIndex(index);
    }
  }, [todos]);

  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  useInterval(() => {
    setCurrentTimestamp(Date.now());
  }, 1000);

  if (todos.length === 0) {
    return null;
  }

  if (!currentTimestamp) {
    return null;
  }

  const { totalTimestamp } = timestampCollector(
    todos[index] ?? todos[0],
    0,
    currentTimestamp,
  );

  const totalSeconds = Math.floor(totalTimestamp / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center mb-3 w-[300px]">
        <Button onClick={() => setIndex(index - 1)} isDisabled={index === 0}
          variant="light"
          isIconOnly
        >
          <CircleRightIcon />
        </Button>
        <div className="flex items-center justify-center w-full overflow-auto">
          <h2 className="text-center text-2xl font-semibold mb-3 w-full">
            {todos[index].title}
          </h2>
        </div>
          <Button
            onClick={() => setIndex(index + 1)}
            isDisabled={index === todos.length - 1}
            isIconOnly
            variant="light">
          <CircleRightIcon className="transform rotate-180" />
        </Button>
      </div>
      <TimerStyled seconds={seconds} minutes={minutes} hours={hours} />
      <TodoActions todo={todos[index]} />
    </div>
  );
}
