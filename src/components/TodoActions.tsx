"use client";

import { useDisclosure } from "@nextui-org/react";
import { useFormState } from "react-dom";
import {
  AddIcon,
  EyeIcon,
  PlayIcon,
  PauseIcon,
  DoneIcon,
  EditIcon,
  DeleteIcon,
  SleepIcon,
  ArchiveIcon,
} from "./icons";
import EditTodoModal from "./EditTodoModal";
import { deleteTodo, completeTodo, pauseTodo, playTodo, pendingTodo } from "@/actions";
import { TodoActionsProps } from "@/types";
import TooltipIconButton from "./TooltipIconButton";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import AddTodoModal from "./AddTodoModal";
import { archiveTodo } from "@/actions/archive-todo";

export default function TodoActions({ todo }: TodoActionsProps) {
  const [_1, actionComplete] = useFormState(completeTodo, { message: "" });
  const [_2, actionPlay] = useFormState(playTodo, { message: "" });
  const [_3, actionPause] = useFormState(pauseTodo, { message: "" });
  const [_4, actionPending] = useFormState(pendingTodo, { message: "" });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onOpenChange: onOpenChangeAdd,
  } = useDisclosure();
  const session = useSession();
  const pathname = usePathname()
  const { userId, ids } = useParams();
  const link = `/user/${session.data?.user?.id}/todos${ids ? `/${(ids as string[]).join("/")}` : ""}`;

  return (
    <div className="flex gap-2">
      {todo.children.length === 0 &&
        !pathname.includes("timer") &&
        todo.status !== "in-progress" &&
        todo.status !== "completed" && (
          <TooltipIconButton content="Add child todo" onPress={onOpenAdd}>
            <AddIcon />
          </TooltipIconButton>
        )}
      {
        !pathname.includes("timer") &&
        todo.children.length > 0 && (
        <TooltipIconButton
          content="Go to child Todo"
          href={`${link}/${todo.id}`}
        >
          <EyeIcon />
        </TooltipIconButton>
      )}
      {todo.children.length === 0 &&
        (todo.status === "not-started" || todo.status === "pause") && (
          <TooltipIconButton
            content="Play"
            action={actionPlay}
            hiddenInputData={[{ name: "id", value: todo.id.toString() }, { name: "pathname", value: pathname }]}
          >
            <PlayIcon />
          </TooltipIconButton>
        )}
      {todo.children.length === 0 && todo.status === "in-progress" && (
        <TooltipIconButton
          content="Pause"
          action={actionPause}
          hiddenInputData={[{ name: "id", value: todo.id.toString() }]}
        >
          <PauseIcon />
        </TooltipIconButton>
      )}
      {todo.children.length === 0 && todo.status === "in-progress" && (
        <TooltipIconButton
          content="Complete"
          action={actionComplete}
          hiddenInputData={[{ name: "id", value: todo.id.toString() }]}
        >
          <DoneIcon />
        </TooltipIconButton>
      )}

      {!pathname.includes("timer") &&
      <TooltipIconButton content="Edit todo" onPress={onOpen}>
        <EditIcon />
      </TooltipIconButton>}
      <TooltipIconButton
        content="Delete todo"
        action={deleteTodo.bind(null, todo.id, userId as string)}
      >
        <DeleteIcon />
      </TooltipIconButton>
      {todo.children.length === 0 && ["not-started", "pending"].includes(todo.status) && (
        <TooltipIconButton
          content="Pending for later"
          hiddenInputData={[{ name: "id", value: todo.id.toString() }]}
          action={actionPending}
        >
          <SleepIcon />
        </TooltipIconButton>
      )}
      {todo.children.length === 0 && todo.status === "completed" && (
        <TooltipIconButton
          content="Archive"
          action={archiveTodo}
          hiddenInputData={[{ name: "id", value: todo.id.toString() }]}
        >
          <ArchiveIcon />
        </TooltipIconButton>
      )}
      <EditTodoModal isOpen={isOpen} onOpenChange={onOpenChange} todo={todo} />
      <AddTodoModal
        isOpen={isOpenAdd}
        onOpenChange={onOpenChangeAdd}
        parentId={todo.id}
      />
    </div>
  );
}
