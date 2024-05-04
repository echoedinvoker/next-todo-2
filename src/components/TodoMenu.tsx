"use client";

import { useDisclosure } from "@nextui-org/react";
import { AddTodoModal, TooltipIconButton } from "@/components"
import { useParams } from "next/navigation";
import { PlusIcon } from "./icons";

export default function TodoMenu() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { ids } = useParams();
  const parentId = ids ? ids.at(-1) : null;

  return (
    <>
        <TooltipIconButton
          content="Add Todo"
          onPress={onOpen}
          size="sm"
        >
          <PlusIcon />
        </TooltipIconButton>

        <AddTodoModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          parentId={Number(parentId)}
        />
    </>
  );
}


