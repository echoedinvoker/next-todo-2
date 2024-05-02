"use client";

import { Button, useDisclosure } from "@nextui-org/react";
import AddTodoModal from "./AddTodoModal";
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import { backTodo } from "@/actions/back-todo";

export default function TodoMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [formState, action] = useFormState(backTodo, { message: "" });
  const { id } = useParams();

  return (
    <>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: ".5rem",
      }}>
        <Button onPress={onOpen} size="sm"
          variant="shadow"
          style={{ width: "10%" }}>
          NEW
        </Button>
        <form action={action}>
          <input type="hidden" name="id" value={id ? id : ""} />
          <Button type="submit"
            variant="shadow"
            isDisabled={ !id }
            size="sm" style={{ width: "10%" }}>
            BACK
          </Button>
        </form>
        </div>

      <AddTodoModal isOpen={isOpen} onOpenChange={onOpenChange} parentId={id} />
    </>
  );
}
