import TodoList from "@/components/TodoList";
import { db } from "@/db";

export default async function TodoListPage({ params }: { params: { ids: string[] } }) {
  const { ids } = params;
  const todos = await db.todo.findMany({
    where: { parentId: Number(ids.at(-1)!) },
    include: { children: true },
  });

  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <TodoList todos={todos} />
    </div>
  );
}
