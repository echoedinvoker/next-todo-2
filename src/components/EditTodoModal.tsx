"use client";

import { editTodo } from "@/actions/edit-todo";
import { timeFormatter } from "@/helpers/time-formatter";
import { useFormattedTime } from "@/hooks/use-formatted-time";
import { TodoWithChildren } from "@/types";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";
import FormButton from "./common/FormButton";

interface EditTodoModalProps {
  isOpen: boolean;
  onOpenChange: any;
  todo: TodoWithChildren;
}

export default function EditTodoModal({
  isOpen,
  onOpenChange,
  todo,
}: EditTodoModalProps) {
  const [_, action] = useFormState(editTodo, { message: "" });
  const [name, setName] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const {
    formattedTime: duration,
    setFormattedTime: setDuration,
    isFormattedTimeValid: isDurationValid,
    timestamp: durationTimestamp,
  } = useFormattedTime(
    todo.duration ? timeFormatter({ milliseconds: todo.duration }) : "",
  );

  const {
    formattedTime: timeSpent,
    setFormattedTime: setTimeSpent,
    isFormattedTimeValid: isTimeSpentValid,
    timestamp: timeSpentTimestamp,
  } = useFormattedTime();

  const disabled = useMemo(() => {
    return !name || !isTimeSpentValid || !isDurationValid;
  }, [name, isTimeSpentValid, isDurationValid]);

  useEffect(() => {
    isOpen &&
      setTimeSpent(
        timeFormatter({
          milliseconds:
            todo.timeSpent +
            (todo.status === "in-progress"
              ? Date.now() - todo.updatedAt.getTime()
              : 0),
        }),
      );
  }, [isOpen, setTimeSpent, todo.timeSpent, todo.status, todo.updatedAt]);

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
                value={name}
                onValueChange={setName}
              />
              <Input
                label="Description (optional)"
                name="description"
                placeholder="Enter TODO description"
                variant="bordered"
                value={description}
                onValueChange={setDescription}
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
              <input name="id" type="hidden" value={todo.id} />
              <input name="oldTimeSpent" type="hidden" value={todo.timeSpent} />
              {durationTimestamp !== null  && !isNaN(durationTimestamp) && (
                <input
                  name="duration"
                  type="hidden"
                  value={durationTimestamp}
                />
              )}
              {timeSpentTimestamp !== null && !isNaN(timeSpentTimestamp) && (
                <input
                  name="timeSpent"
                  type="hidden"
                  value={timeSpentTimestamp}
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <FormButton color="primary" type="submit" onPress={onClose} isDisabled={disabled}>
                Edit TODO
              </FormButton>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
