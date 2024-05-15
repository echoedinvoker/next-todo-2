"use client";

import { addTodo } from "@/actions";
import { useFormattedTime } from "@/hooks/use-formatted-time";
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
import { useEffect } from "react";
import { useFormState } from "react-dom";
import FormButton from "./common/FormButton";

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
  const {
    formattedTime: duration,
    setFormattedTime: setDuration,
    isFormattedTimeValid: isDurationValid,
    timestamp: durationTimestamp,
  } = useFormattedTime();

  const session = useSession();

  useEffect(() => {
    if (isOpen) {
      setDuration("");
    }
  }, [isOpen, setDuration]);

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
                label="Description (optional)"
                name="description"
                placeholder="Enter TODO description"
                variant="bordered"
              />
              <Input
                label="Duration (min, optional)"
                placeholder="Enter TODO duration"
                variant="bordered"
                value={duration}
                onValueChange={setDuration}
                isInvalid={!isDurationValid}
                errorMessage={!isDurationValid && "Invalid duration format"}
                color={!isDurationValid ? "danger" : undefined}
              />
              {parentId > 0 && <input name="parentId" type="hidden" value={parentId} />}
              {durationTimestamp !== null  && !isNaN(durationTimestamp) && (
                <input
                  name="duration"
                  type="hidden"
                  value={durationTimestamp}
                />
              )}
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
              <FormButton color="primary" type="submit" onPress={onClose}>
                Add TODO
              </FormButton>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
