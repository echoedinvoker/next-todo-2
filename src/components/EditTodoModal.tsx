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
  }, [name, isTimeSpentValid]);

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
  }, [isOpen]);

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
                autoFocus
                label="Description (optional)"
                name="description"
                placeholder="Enter TODO description"
                variant="bordered"
                value={description}
                onValueChange={setDescription}
              />
              <Input
                autoFocus
                label="Duration (min, optional)"
                placeholder="Enter TODO duration"
                variant="bordered"
                value={duration}
                onValueChange={setDuration}
                isInvalid={!isDurationValid}
                errorMessage={!isDurationValid && "Invalid duration format"}
                color={!isDurationValid ? "danger" : undefined}
              />
              <Input
                autoFocus
                label="Elasped (min, optional)"
                placeholder="Enter TODO elasped"
                variant="bordered"
                value={timeSpent}
                onValueChange={setTimeSpent}
                isInvalid={!isTimeSpentValid}
                errorMessage={!isTimeSpentValid && "Invalid time spent format"}
                color={!isTimeSpentValid ? "danger" : undefined}
              />
              <input name="id" type="hidden" value={todo.id} />
              <input name="oldTimeSpent" type="hidden" value={todo.timeSpent} />
              {durationTimestamp !== null && (
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
              <Button
                color="primary"
                onPress={onClose}
                type="submit"
                isDisabled={disabled}
              >
                Edit TODO
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
