"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Tooltip,
  useDisclosure,
  Link,
} from "@nextui-org/react";
import { Key, useCallback, useState } from "react";
import { DeleteIcon } from "./icons/DeleteIcon";
import { deleteTodo } from "@/actions";
import { AddIcon } from "./icons/AddIcon";
import AddTodoModal from "./AddTodoModal";
import { EyeIcon } from "./icons/EyeIcon";
import { Todo } from "@prisma/client";
import { useFormState } from "react-dom";
import { completeTodo } from "@/actions/complete-todo";
import { DoneIcon } from "./icons/DoneIcon";
import { PlayIcon } from "./icons/PlayIcon";
import { PauseIcon } from "./icons/PauseIcon";
import { playTodo } from "@/actions/play-todo";
import { pauseTodo } from "@/actions/pause-todo";
import TimeElapsed from "./TimeElasped";
import EditTodoModal from "./EditTodoModal";
import { EditIcon } from "./icons/EditIcon";

interface TodoWithChildren extends Todo {
  children: Todo[];
}

function timeFormatter(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours ? `${hours}h ` : ""}${remainingMinutes ? `${remainingMinutes}m ` : ""}`;
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
          return todo.duration ? timeFormatter(todo.duration) : "N/A";
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
              onDrop={(e) => {
                e.preventDefault();
                const draggingId = e.dataTransfer.getData("dragged-todo-id");
                console.log("dropped", draggingId, item.id);
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
interface TodoActionsProps {
  todo: TodoWithChildren;
  handleAddTodo: (parentId: number) => void;
}

function TodoActions({ todo, handleAddTodo }: TodoActionsProps) {
  const [_1, actionComplete] = useFormState(completeTodo, { message: "" });
  const [_2, actionPlay] = useFormState(playTodo, { message: "" });
  const [_3, actionPause] = useFormState(pauseTodo, { message: "" });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="flex gap-2">
      {todo.children.length === 0 && todo.status !== "in-progress" && (
        <Tooltip content="Add child todo">
          <span className="text-lg text-info cursor-pointer active:opacity-50">
            <Button onPress={() => handleAddTodo(todo.id)} isIconOnly>
              <AddIcon />
            </Button>
          </span>
        </Tooltip>
      )}
      {todo.children.length > 0 && (
        <Tooltip content="Go to child Todo">
          <span className="text-lg text-info active:opacity-50">
            <Button href={`/todo/${todo.id}`} as={Link} isIconOnly>
              <EyeIcon />
            </Button>
          </span>
        </Tooltip>
      )}
      {todo.children.length === 0 &&
        (todo.status === "not-started" || todo.status === "pause") && (
          <Tooltip content="Play">
            <span className="text-lg text-info active:opacity-50">
              <form action={actionPlay}>
                <input type="hidden" name="id" value={todo.id} />
                <Button type="submit" isIconOnly>
                  <PlayIcon />
                </Button>
              </form>
            </span>
          </Tooltip>
        )}
      {todo.children.length === 0 && todo.status === "in-progress" && (
        <Tooltip content="Pause">
          <span className="text-lg text-info active:opacity-50">
            <form action={actionPause}>
              <input type="hidden" name="id" value={todo.id} />
              <Button type="submit" isIconOnly>
                <PauseIcon />
              </Button>
            </form>
          </span>
        </Tooltip>
      )}
      {todo.children.length === 0 && todo.status === "in-progress" && (
        <Tooltip content="Complete">
          <span className="text-lg text-info active:opacity-50">
            <form action={actionComplete}>
              <input type="hidden" name="id" value={todo.id} />
              <Button type="submit" isIconOnly>
                <DoneIcon />
              </Button>
            </form>
          </span>
        </Tooltip>
      )}
      <Tooltip content="Edit todo">
        <span className="text-lg text-danger cursor-pointer active:opacity-50">
          <Button onPress={onOpen} isIconOnly>
            <EditIcon />
          </Button>
          <EditTodoModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            todo={todo}
          />
        </span>
      </Tooltip>
      <Tooltip content="Delete todo">
        <span className="text-lg text-danger cursor-pointer active:opacity-50">
          <form action={deleteTodo.bind(null, todo.id)}>
            <Button type="submit" isIconOnly>
              <DeleteIcon />
            </Button>
          </form>
        </span>
      </Tooltip>
    </div>
  );
}
