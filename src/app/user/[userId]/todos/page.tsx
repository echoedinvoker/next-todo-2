import { auth } from "@/auth";
import { TodoList, TodoMenu } from "@/components";
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
      <div className="flex gap-2 items-center">
        <TodoMenu />
        <Breads userId={session?.user?.id ?? ""} ids={[]} />
      </div>
      <TodoList todos={todos} />
    </div>
  );
}
