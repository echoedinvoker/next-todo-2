import { auth } from "@/auth";
import { TodoList } from "@/components";
import Breads from "@/components/Breads";
import { db } from "@/db";

export default async function TodoListPage() {
  const session = await auth();

  const todos = await db.todo.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <Breads userId={session?.user?.id ?? ""} ids={[]} />
      <TodoList todos={todos} />
    </div>
  );
}
