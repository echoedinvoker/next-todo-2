import { Todo } from "@prisma/client";

export interface TodoWithChildren extends Todo {
  children: Todo[];
}

export interface TodoActionsProps {
  todo: TodoWithChildren;
}
