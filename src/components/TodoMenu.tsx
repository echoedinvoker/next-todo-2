"use client";

import { useDisclosure } from "@nextui-org/react";
import { AddTodoModal, RegularButton } from "@/components"
import { useParams } from "next/navigation";
import { useFormState } from "react-dom";
import { backTodo } from "@/actions/back-todo";

export default function TodoMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [_, action] = useFormState(backTodo, { message: "" });
  const { ids } = useParams();
  const parentId = ids ? ids.at(-1) : null;

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
          actionData={[
            { name: "id", value: parentId ? parentId.toString() : "" },
          ]}
          isDisabled={!parentId}
        >
          BACK
        </RegularButton>
      </div>

        <AddTodoModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          parentId={Number(parentId)}
        />
    </>
  );
}


