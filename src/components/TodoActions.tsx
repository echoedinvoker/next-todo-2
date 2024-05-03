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
} from "./icons";
import EditTodoModal from "./EditTodoModal";
import { deleteTodo, completeTodo, pauseTodo, playTodo } from "@/actions";
import { TodoActionsProps } from "@/types";
import TooltipIconButton from "./TooltipIconButton";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export default function TodoActions({ todo, handleAddTodo }: TodoActionsProps) {
  const [_1, actionComplete] = useFormState(completeTodo, { message: "" });
  const [_2, actionPlay] = useFormState(playTodo, { message: "" });
  const [_3, actionPause] = useFormState(pauseTodo, { message: "" });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const session = useSession();
  const { idx } = useParams();
  const link = `/user/${session.data?.user?.id}/todos${idx ? `/${(idx as string[]).join("/")}` : ""}`;

  return (
    <div className="flex gap-2">
      {todo.children.length === 0 && todo.status !== "in-progress" && (
        <TooltipIconButton
          content="Add child todo"
          onPress={() => handleAddTodo(todo.id)}
        >
          <AddIcon />
        </TooltipIconButton>
      )}
      {todo.children.length > 0 && (
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
            hiddenInputData={[{ name: "id", value: todo.id.toString() }]}
          >
            <PlayIcon />
          </TooltipIconButton>
        )}
      {todo.children.length === 0 && todo.status === "in-progress" && (
        <TooltipIconButton content="Pause"
          action={actionPause}
          hiddenInputData={[{ name: "id", value: todo.id.toString() }]}
        >
          <PauseIcon />
        </TooltipIconButton>
      )}
      {todo.children.length === 0 && todo.status === "in-progress" && (
        <TooltipIconButton content="Complete"
          action={actionComplete}
          hiddenInputData={[{ name: "id", value: todo.id.toString() }]}
        >
          <DoneIcon />
        </TooltipIconButton>
      )}
      <TooltipIconButton content="Edit todo"
        onPress={onOpen}
      >
        <EditIcon />
      </TooltipIconButton>
      <TooltipIconButton content="Delete todo"
        action={deleteTodo.bind(null, todo.id)}
      >
        <DeleteIcon />
      </TooltipIconButton>
      <EditTodoModal isOpen={isOpen} onOpenChange={onOpenChange} todo={todo} />
    </div>
  );
}