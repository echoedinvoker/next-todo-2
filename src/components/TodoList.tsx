"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
} from "@nextui-org/react";
import { Key, useState } from "react";
import { AddTodoModal, RenderCell } from "@/components"
import { TodoWithChildren } from "@/types";
import { switchTodoOrder } from "@/actions/switch-todo-order";


const headers = [
  { key: "title", label: "Title" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
  { key: "children", label: "Entries" },
  { key: "duration", label: "Duration" },
  { key: "timeSpent", label: "Elapsed" },
];


export default function TodoList({ todos }: { todos: TodoWithChildren[] }) {
  const [parentId, setParentId] = useState(0);
  const sortedTodos = todos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <>
      <Table aria-label="Todos">
        <TableHeader>
          {headers.map((header) => (
            <TableColumn key={header.key}>{header.label}</TableColumn>
          ))}
        </TableHeader>
        <TableBody items={sortedTodos}>
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
                await switchTodoOrder(draggingId, item.id);
              }}
            >
              {(columnKey) => (
                <TableCell>
                  <RenderCell
                    item={item}
                    columnKey={columnKey as Key}
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
