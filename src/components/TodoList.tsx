"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  useDisclosure,
} from "@nextui-org/react";
import { Key, useCallback, useState } from "react";
import AddTodoModal from "./AddTodoModal";
import { Todo } from "@prisma/client";
import TimeElapsed from "./TimeElasped";
import { switchTodoOrder } from "@/actions/switch-todo-order";
import { timeFormatter } from "@/helpers/time-formatter";
import TodoActions from "./TodoActions";

interface TodoWithChildren extends Todo {
  children: Todo[];
}

export default function TodoList({ todos }: { todos: TodoWithChildren[] }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [parentId, setParentId] = useState(0);
  const sortedTodos = todos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleAddTodo = (parentId: number) => {
    setParentId(parentId);
    onOpen();
  };

  const renderCell = useCallback(
    (todo: TodoWithChildren, columnKey: Key) => {
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
  return (
    <>
      <Table aria-label="Todos">
        <TableHeader>
          <TableColumn key="title">Title</TableColumn>
          <TableColumn key="status">Status</TableColumn>
          <TableColumn key="actions">Actions</TableColumn>
          <TableColumn key="children">Entries</TableColumn>
          <TableColumn key="duration">Duration</TableColumn>
          <TableColumn key="timeSpent">Elapsed</TableColumn>
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
                <TableCell>{renderCell(item, columnKey) as any}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddTodoModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        {...{ parentId }}
      />
    </>
  );
}
