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
import RenderCell from "./RenderCell";

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
                <TableCell>
                  <RenderCell
                    item={item}
                    columnKey={columnKey as Key}
                    handleAddTodo={handleAddTodo}
                  />
                </TableCell>
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
