import { auth } from "@/auth";
import { TodoList, TodoMenu } from "@/components";
import Breads from "@/components/Breads";
import { sortTodos } from "@/helpers/sort-todos";

export default async function TodoListPage() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const sortedTodos = await sortTodos(session.user?.id)
  const todos = sortedTodos.filter((todo) => todo.parentId === null).filter((todo) => todo.status !== "archived");

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

