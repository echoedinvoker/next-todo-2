import TodoList from "@/components/TodoList";
import { db } from "@/db";
import { sortTodos } from "@/helpers/sort-todos";

export default async function TodoListPage({ params }: { params: { ids: string[] } }) {
  const { ids } = params;
  const todos = await db.todo.findMany({
    where: { parentId: Number(ids.at(-1)!) },
    include: { children: true },
  });

  const sortedTodos = await sortTodos(todos);

  return <TodoList todos={sortedTodos} />;
}
