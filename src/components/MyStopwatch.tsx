"use client";

import React, { useEffect, useState } from "react";
import TimerStyled from "./TimerStyled";
import { useInterval } from "react-use";
import { timestampCollector } from "@/helpers";
import { TodoWithChildren } from "@/types";
import TodoActions from "./TodoActions";
import { CircleRightIcon, SleepIcon } from "./icons";
import {
  Button,
} from "@nextui-org/react";
import { useTimer } from "react-timer-hook";
import TooltipIconButton from "./TooltipIconButton";

const ExiryTimeSeconds = 300;

export default function MyStopwatch({ todos }: { todos: TodoWithChildren[] }) {
  const [index, setIndex] = useState(0);
  const [expired, setExpired] = useState(false);
  const [restTimes, setRestTimes] = useState<number>(0);
  const [timerStatus, setTimerStatus] = useState<"stopwatch" | "timer">(
    "stopwatch",
  );

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + ExiryTimeSeconds);

  const {
    seconds: timerSeconds,
    minutes: timerMinutes,
    hours: timerHours,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => setExpired(true),
  });

  useEffect(() => {
    const hasInProgress = todos.some((todo) =>
      ["pause", "in-progress"].includes(todo.status),
    );
    if (hasInProgress) {
      setTimerStatus("stopwatch");
    } else {
      const expiryTimestamp = new Date();
      expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + ExiryTimeSeconds);
      restart(expiryTimestamp);
      setExpired(false);
      setTimerStatus("timer");
    }
  }, [todos]);

  useEffect(() => {
    const index = todos.findIndex((todo) => todo.status === "in-progress");
    if (index !== -1) {
      setIndex(index);
    }
    setRestTimes(0)
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
    <>
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center mb-3 w-[300px]">
          <Button
            onClick={() => setIndex(index - 1)}
            isDisabled={index === 0}
            variant="light"
            isIconOnly
          >
            <CircleRightIcon />
          </Button>
          <div className="flex items-center justify-center w-full overflow-auto">
            <h2 className="text-center text-xl font-semibold my-4 w-full">
              {todos[index].title}
            </h2>
          </div>
          <Button
            onClick={() => setIndex(index + 1)}
            isDisabled={index === todos.length - 1}
            isIconOnly
            variant="light"
          >
            <CircleRightIcon className="transform rotate-180" />
          </Button>
        </div>
        {timerStatus === "stopwatch" ? (
          <TimerStyled seconds={seconds} minutes={minutes} hours={hours} />
        ) : (
          <TimerStyled
            seconds={timerSeconds}
            minutes={timerMinutes}
            hours={timerHours}
          />
        )}
        <div className="flex gap-2">
        <TodoActions todo={todos[index]} />
          {timerStatus === 'timer' && expired && (
          <TooltipIconButton
            onPress={() => {
            const expiryTimestamp = new Date();
            expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + ExiryTimeSeconds);
            restart(expiryTimestamp);
            setExpired(false);
            setRestTimes((prev) => prev + 1);
          }} content="Restart timer"><SleepIcon /></TooltipIconButton>
        )}
        </div>
        {timerStatus === "timer" && restTimes > 0 && (
          <p className="text-sm text-gray-500 mt-2">Rest times: {restTimes}</p>
        )}
      </div>
    </>
  );
}
