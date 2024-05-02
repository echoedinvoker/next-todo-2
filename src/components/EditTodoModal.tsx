"use client";

import { editTodo } from "@/actions/edit-todo";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Input,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function EditTodoModal({ isOpen, onOpenChange, todo }: any) {
  const [formState, action] = useFormState(editTodo, { message: "" });
  const [name, setName] = useState(todo.title);
  const [description, setDescription] = useState(todo.description);
  const [duration, setDuration] = useState(todo.duration ?? "");
  const [timeSpentMin, setTimeSpentMin] = useState(Math.floor(todo.timeSpent / 1000 / 60).toString());

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
                type="number"
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
