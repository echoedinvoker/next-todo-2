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
import {
  switchTodoOrder,
} from "@/actions";
import FormTableCell from "./FormTableCell";

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
            <TableColumn key={header.key}
              >{header.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={filteredTodos}>
          {(item) => (
            <TableRow
              key={item.id}
              draggable={true}
              onDragStart={(e) => {
                e.dataTransfer.setData('drag-todo-id', item.id.toString());
              }}
              onDragOver={(e) => {
                e.preventDefault();
              }}
              onDrop={(e) => {
                const dragTodoId = e.dataTransfer.getData('drag-todo-id');
                switchTodoOrder(params, Number(dragTodoId), item.id);
              }}
            >
              {(columnKey) => (
                <FormTableCell>
                  <RenderCell
                    item={item}
                    columnKey={columnKey as Key}
                    isLeaves={isLeaves}
                  />
                </FormTableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
