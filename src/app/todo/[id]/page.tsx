import TodoList from "@/components/TodoList";
import { db } from "@/db";

interface TodoListPageProps {
  params: { id: string };
}

export default async function TodoListPage({ params }: TodoListPageProps) {
  const todos = await db.todo.findMany({
    where: { parentId: Number(params.id) },
    include: { children: true },
  });

  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <TodoList todos={todos} />
    </div>
  );
}
