"use client";

import { Todo } from "@prisma/client";
import { useState } from "react";
import { useInterval } from "react-use";

interface TodoWithChildren extends Todo {
  children: Todo[];
}

function timeFormatter(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours ? `${hours}h ` : ""}${minutes ? `${minutes}m ` : ""}${remainingSeconds}s`;
}

export default function TimeElapsed({ todo }: { todo: TodoWithChildren }) {
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  const diff = (currentTimestamp ?? 0) - todo.updatedAt.getTime();
  const elapsedChild = Math.floor(
    (todo.timeSpent +
      (todo.status === "in-progress" ? (diff > 0 ? diff : 0) : 0)) /
      1000,
  );
  const elapsedParent = Math.floor(todo.timeSpent / 1000);

  useInterval(() => {
    setCurrentTimestamp(Date.now());
  }, 1000);

  if (!currentTimestamp) return null;

  if (todo.children.length > 0)
    return <div>{timeFormatter(elapsedParent)}</div>;

  return <div>{timeFormatter(elapsedChild)}</div>;
}
