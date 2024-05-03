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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: ".5rem",
        }}
      >
        <RegularButton onPress={onOpen}>New</RegularButton>
        <RegularButton
          action={action}
          actionData={[{ name: "id", value: id ? id.toString() : "" }]}
          isDisabled={!id}
        >
          BACK
        </RegularButton>
      </div>

      <AddTodoModal isOpen={isOpen} onOpenChange={onOpenChange} parentId={id} />
    </>
  );
}

interface RegularButtonProps {
  children: React.ReactNode;
  actionData?: { name: string; value: string }[];
  isDisabled?: boolean;
  onPress?: () => void;
  action?: (payload: FormData) => void;
}

function RegularButton({
  children,
  onPress,
  action,
  actionData,
  isDisabled,
}: RegularButtonProps) {
  if (onPress) {
    return (
      <Button
        onPress={onPress}
        size="sm"
        variant="shadow"
        style={{ width: "10%" }}
        isDisabled={!!isDisabled}
      >
        {children}
      </Button>
    );
  }
  if (action) {
    return (
      <form action={action}>
        {actionData &&
          actionData.map(({ name, value }) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        <Button
          type="submit"
          variant="shadow"
          isDisabled={!!isDisabled}
          size="sm"
          style={{ width: "10%" }}
        >
          {children}
        </Button>
      </form>
    );
  }
  return null;
}
