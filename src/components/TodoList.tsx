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
import { CustomCheckbox, RenderCell } from "@/components";
import { TodoWithChildren } from "@/types";
import { useParams } from "next/navigation";
import { switchLeafOrderJumpDown, switchLeafOrderJumpUp, switchTodoOrder, switchLeafOrder } from "@/actions";

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
  const [groupSelected, setGroupSelected] = useState<string[]>([]);
  useEffect(() => {
    const groupSelected = JSON.parse(
      localStorage.getItem(
        isLeaves ? "leavesStatusFilter" : "todosStatusFilter",
      ) ?? "[]",
    );
    setGroupSelected(groupSelected);
  }, []);

  function handleChangedGroupSelected(value: string[]) {
    setGroupSelected(value);
    if (isLeaves) {
      localStorage.setItem("leavesStatusFilter", JSON.stringify(value));
    } else {
      localStorage.setItem("todosStatusFilter", JSON.stringify(value));
    }
  }
  const params = useParams();
  const filteredTodos = todos.filter((todo) => {
    if (groupSelected.length === 0) return true;
    return groupSelected.includes(todo.status);
  });

  async function handleUp(id: number) {
    await switchLeafOrderJumpUp(params, id, groupSelected);
  }
  async function handleDown(id: number) {
    await switchLeafOrderJumpDown(params, id, groupSelected);
  }

  return (
    <>
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
                e.dataTransfer.setData("dragged-todo-id", item.id.toString());
              }}
              onDragEnd={() => {}}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={async (e) => {
                e.preventDefault();
                const draggingId = e.dataTransfer.getData("dragged-todo-id");
                if (!isLeaves) {
                  await switchTodoOrder(params, Number(draggingId), item.id);
                } else {
                  await switchLeafOrder(params, Number(draggingId), item.id);
                }
              }}
            >
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    item={item}
                    columnKey={columnKey as Key}
                    isLeaves={isLeaves}
                    onUp={handleUp}
                    onDown={handleDown}
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
