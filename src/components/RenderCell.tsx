"use client";

import { Todo, TodoWithChildren } from "@/types";
import { Chip } from "@nextui-org/react";
import { Key, useCallback } from "react";
import TodoActions from "./TodoActions";
import TimeElapsed from "./TimeElasped";
import { timeFormatter } from "@/helpers/time-formatter";
import Link from "next/link";
import { DownIcon, UpIcon } from "./icons";

interface RenderCellProps {
  item: TodoWithChildren;
  columnKey: Key;
  isLeaves?: boolean;
  onUp?: (id: number) => void;
  onDown?: (id: number) => void;
}

export default function RenderCell({
  item,
  columnKey,
  isLeaves = false,
}: RenderCellProps) {
  const renderCell = useCallback((todo: TodoWithChildren, columnKey: Key) => {
    const cellValue = todo[columnKey as keyof Todo];


    switch (columnKey) {
      case "title":
        return (
          <div className="flex gap-1 items-center">
            <div className="flex flex-col gap-1">
              {isLeaves && (
                <div>
                  {todo.parentList.length > 0 && (
                    <Link
                      className="text-xs text-default-500 border-default border-2 rounded-full px-2 py-1 hover:bg-default-500 hover:text-white"
                      href={`/user/${todo.userId}/todos/${todo.parentList.map((list: any) => list.id).join("/")}`}
                    >
                      {todo.parentList.at(-1).title}
                    </Link>
                  )}
                </div>
              )}
              <div>{cellValue as any}</div>
            </div>
          </div>
        );
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
        return todo.duration
          ? timeFormatter({ milliseconds: todo.duration })
          : "N/A";
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
  }, [isLeaves]);
  return <>{renderCell(item, columnKey)}</>;
}
