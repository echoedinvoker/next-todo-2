import { db } from "@/db";
import { TodoWithChildren } from "@/types";

export async function sortTodos(userId: string) {
  const todos = await db.todo.findMany({
    where: { userId },
    select: { id: true, order: true, updatedAt: true },
  });

  todos.sort((a, b) => {
    return a.order - b.order;
  });

  const sortedTodos = await Promise.all(
    todos.map(async (todo, i) => {
      const sortedTodo = await db.todo.update({
        where: { id: todo.id },
        data: { order: i + 1, updatedAt: todo.updatedAt },
        include: { children: true },
      });
      return sortedTodo;
    })
  );

  return sortedTodos as TodoWithChildren[];
}
