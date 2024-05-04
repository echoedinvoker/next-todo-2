"use client";

import { addTodo } from "@/actions";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useFormState } from "react-dom";

export default function AddTodoModal({
  isOpen,
  onOpenChange,
  parentId,
}: {
  isOpen: boolean;
  onOpenChange: any;
  parentId: number;
}) {
  const [_, action] = useFormState(addTodo, null as any);
  const session = useSession();

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <form action={action}>
            <ModalHeader className="flex flex-col gap-1">New TODO</ModalHeader>

            <ModalBody>
              <Input
                autoFocus
                label="Name"
                name="title"
                placeholder="Enter TODO name"
                variant="bordered"
              />
              <Input
                autoFocus
                label="Description (optional)"
                name="description"
                placeholder="Enter TODO description"
                variant="bordered"
              />
              <Input
                autoFocus
                label="Duration (min, optional)"
                name="duration"
                placeholder="Enter TODO duration"
                variant="bordered"
                type="number"
              />
              {parentId && <input name="parentId" type="hidden" value={parentId} />}
              <input
                name="userId"
                type="hidden"
                value={session.data?.user?.id}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose} type="submit">
                Add TODO
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
