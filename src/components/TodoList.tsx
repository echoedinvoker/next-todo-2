"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  CheckboxGroup,
} from "@nextui-org/react";
import { Key, useEffect, useState } from "react";
import { CustomCheckbox, RenderCell, TooltipIconButton } from "@/components";
import { TodoWithChildren } from "@/types";
import { useParams } from "next/navigation";
import { timeFormatter } from "@/helpers/time-formatter";
import { archiveAllCompletedTodos, switchTodoOrder } from "@/actions";
import { ArchiveIcon } from "./icons";

const headers = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
  { key: "children", label: "Entries" },
  { key: "duration", label: "Duration" },
  { key: "timeSpent", label: "Elapsed" },
];

export default function TodoList({
  todos,
  isLeaves = false,
}: {
  todos: TodoWithChildren[];
  isLeaves?: boolean;
}) {
  const params = useParams();
  const [groupSelected, setGroupSelected] = useState<string[]>([]);

  useEffect(() => {
    const groupSelected = JSON.parse(
      localStorage.getItem(
        isLeaves ? "leavesStatusFilter" : "todosStatusFilter",
      ) ?? "[]",
    );
    setGroupSelected(groupSelected);
  }, [isLeaves, setGroupSelected]);

  function handleChangedGroupSelected(value: string[]) {
    setGroupSelected(value);
    if (isLeaves) {
      localStorage.setItem("leavesStatusFilter", JSON.stringify(value));
    } else {
      localStorage.setItem("todosStatusFilter", JSON.stringify(value));
    }
  }
  const filteredTodos = todos.filter((todo) => {
    if (groupSelected.length === 0) return true;
    return groupSelected.includes(todo.status);
  });

  return (
    <>
      {isLeaves && (
        <div className="mb-4">
          <div className="mb-2">
            <div>{`Total Elasped Time: ${timeFormatter({ milliseconds: todos.reduce((acc, todo) => acc + todo.timeSpent, 0) })}`}</div>
            <div>{`Completed/Total Entries: ${todos.reduce((acc, todo) => {
              return acc + (todo.status === "completed" ? 1 : 0);
            }, 0)}/${todos.filter((todo) => todo.status !== "pending").length}`}</div>
            <div>
              {`Completed/Total Duration: ${timeFormatter({
                milliseconds: todos.reduce((acc, todo) => {
                  return (
                    acc + (todo.status === "completed" ? todo.duration ?? 0 : 0)
                  );
                }, 0),
              })}/${timeFormatter({
                milliseconds: todos
                  .filter((todo) => todo.status !== "pending")
                  .reduce((acc, todo) => acc + (todo.duration ?? 0), 0),
              })}`}
            </div>
          </div>
          <div className="flex gap-1">
            <TooltipIconButton
              content="Archive all completed entries"
              action={archiveAllCompletedTodos}
              hiddenInputData={[{ name: "userId", value: params.userId.toString() }]}
            >
              <ArchiveIcon />
            </TooltipIconButton>
          </div>
        </div>
      )}
      <CheckboxGroup
        className="gap-1"
        orientation="horizontal"
        value={groupSelected}
        onChange={handleChangedGroupSelected as any}
      >
        <CustomCheckbox value="not-started">NOT-STARTED</CustomCheckbox>
        <CustomCheckbox value="in-progress">IN-PROGRESS</CustomCheckbox>
        <CustomCheckbox value="pause">PAUSE</CustomCheckbox>
        <CustomCheckbox value="completed">COMPLETED</CustomCheckbox>
        <CustomCheckbox value="pending">PENDING</CustomCheckbox>
      </CheckboxGroup>
      <Table aria-label="Todos">
        <TableHeader>
          {(isLeaves
            ? headers.filter((header) => header.key !== "children")
            : headers
          ).map((header) => (
            <TableColumn key={header.key}>{header.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={filteredTodos}>
          {(item) => (
            <TableRow
              key={item.id}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData("drag-todo-id", item.id.toString());
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                const dragTodoId = e.dataTransfer.getData("drag-todo-id");
                switchTodoOrder(params, Number(dragTodoId), item.id);
              }}
            >
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    item={item}
                    columnKey={columnKey as Key}
                    isLeaves={isLeaves}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
