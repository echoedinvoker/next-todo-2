import { db } from "@/db";
import { TodoWithChildren } from "@/types";

export async function sortTodos(todos: TodoWithChildren[]) {
  const sortedTodos = []
  // sort by order
  todos.sort((a, b) => {
    return a.order - b.order;
  });
  // reset value of order from 1
  for (let i = 0; i < todos.length; i++) {
    const todo = await db.todo.findUnique({
      where: { id: todos[i].id },
      select: { id: true, order: true, updatedAt: true },
    });
    if (!todo) {
      throw new Error("Todos not found");
    }
    const sortedTodo = await db.todo.update({
      where: { id: todos[i].id },
      data: { order: i + 1, updatedAt: todo.updatedAt },
      include: { children: true },
    });
    sortedTodos.push(sortedTodo);
  }

  return sortedTodos as TodoWithChildren[];
}
