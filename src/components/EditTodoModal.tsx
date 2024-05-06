"use client";

import { editTodo } from "@/actions/edit-todo";
import { timeFormatter } from "@/helpers/time-formatter";
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
import { useEffect, useState } from "react";
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
  const [duration, setDuration] = useState(todo.duration ?? "");
  const [timeSpentMin, setTimeSpentMin] = useState(
    timeFormatter({ milliseconds: todo.timeSpent }),
  );

  useEffect(() => {
    console.log("timeSpent", todo.timeSpent);
    isOpen && setTimeSpentMin(timeFormatter({ milliseconds: todo.timeSpent + (
      todo.status === "in-progress" ? (Date.now() - todo.updatedAt.getTime()) : 0
    ) }));
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
      <ModalContent>
        {(onClose) => (
          <form action={action}>
            {timeSpentMin}
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
                name="duration"
                placeholder="Enter TODO duration"
                variant="bordered"
                type="number"
                value={duration}
                onValueChange={setDuration}
              />
              <Input
                autoFocus
                label="Elasped (min, optional)"
                name="timeSpentMin"
                placeholder="Enter TODO elasped"
                variant="bordered"
                value={timeSpentMin}
                onValueChange={setTimeSpentMin}
              />
              <input name="id" type="hidden" value={todo.id} />
              <input name="oldTimeSpent" type="hidden" value={todo.timeSpent} />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose} type="submit">
                Edit TODO
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
}
