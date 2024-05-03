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
  handleAddTodo: any;
}

export default function RenderCell({ item, columnKey, handleAddTodo }: RenderCellProps) {
  const renderCell = useCallback((todo: TodoWithChildren, columnKey: Key) => {
      const cellValue = todo[columnKey as keyof Todo];

      switch (columnKey) {
        case "title":
          return cellValue;
        case "status":
          return (
            <Chip
              className="uppercase font-black text-xs"
              size="md"
              variant="flat"
            >
              {cellValue as string}
            </Chip>
          );
        case "duration":
          return todo.duration ? timeFormatter({ minutes: todo.duration }) : "N/A";
        case "actions":
          return <TodoActions todo={todo} handleAddTodo={handleAddTodo} />;
        case "timeSpent":
          return <TimeElapsed todo={todo} />;
        case "children":
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
    [handleAddTodo],
  );
  return <>{renderCell(item, columnKey)}</>;
}
