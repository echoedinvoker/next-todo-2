'use client';

import { Todo, TodoWithChildren } from "@/types";
import { Chip } from "@nextui-org/react";
import { Key, useCallback } from "react";
import TodoActions from "./TodoActions";
import TimeElapsed from "./TimeElasped";
import { timeFormatter } from "@/helpers/time-formatter";

interface RenderCellProps {
  item: TodoWithChildren;
  columnKey: Key;
  isLeaves?: boolean;
}

export default function RenderCell({ item, columnKey, isLeaves = false }: RenderCellProps) {
  const renderCell = useCallback((todo: TodoWithChildren, columnKey: Key) => {
      const cellValue = todo[columnKey as keyof Todo];

      switch (columnKey) {
        case "title":
          return cellValue;
        case "status":
          return (
            <Chip
              className="border-default text-default-500 uppercase"
              color="primary"
              variant="faded"
            >
              {cellValue as string}
            </Chip>
          );
        case "duration":
          return todo.duration ? timeFormatter({ minutes: todo.duration }) : "N/A";
        case "actions":
          return <TodoActions todo={todo} />;
        case "timeSpent":
          return <TimeElapsed todo={todo} />;
        case "children":
          if (isLeaves) return null;
          if (todo.children.length > 0) {
            const completed = todo.children.filter(
              (child) => child.status === "completed",
            ).length;
            return `${completed}/${todo.children.length}`;
          }
          return "N/A";

        default:
          return cellValue;
      }
    },
    [],
  );
  return <>{renderCell(item, columnKey)}</>;
}
