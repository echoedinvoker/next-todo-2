import { Todo } from "@prisma/client";

export interface TodoWithChildren extends Todo {
  children: Todo[];
  [key: string]: any;
}

export interface TodoActionsProps {
  todo: TodoWithChildren;
}
