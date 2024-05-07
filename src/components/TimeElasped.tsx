"use client";

import { timeFormatter } from "@/helpers/time-formatter";
import { TodoWithChildren } from "@/types";
import { useState } from "react";
import { useInterval } from "react-use";
import RegularButton from "./RegularButton";
import { useRouter } from "next/navigation";
import { timestampCollector } from "@/helpers";

export default function TimeElapsed({ todo }: { todo: TodoWithChildren }) {
  const [currentTimestamp, setCurrentTimestamp] = useState<number | null>(null);
  useInterval(() => {
    setCurrentTimestamp(Date.now());
  }, 1000);

  const router = useRouter();

  if (!currentTimestamp) {
    return null;
  }

  const { totalTimestamp, inProgressTodoId } = timestampCollector(
    todo,
    0,
    currentTimestamp,
  );
  if (inProgressTodoId)
    return (
      <RegularButton
        onPress={() => {
          router.push(`/user/${todo.userId}/timer/${inProgressTodoId}`);
        }}
        variant="solid"
        size="md"
        className="text-base font-semibold"
      >
        {timeFormatter({ milliseconds: totalTimestamp })}
      </RegularButton>
    );
  return (
    <div className={`text-base font-semibold text-default-500 ${
todo.status === "completed" ? "line-through" : ""
}`}>
      {timeFormatter({ milliseconds: totalTimestamp })}
    </div>
  );
}
