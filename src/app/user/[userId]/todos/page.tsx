import { auth } from "@/auth";
import { TodoList, TodoMenu } from "@/components";
import Breads from "@/components/Breads";
import { db } from "@/db";
import { TodoWithChildren } from "@/types";

export default async function TodoListPage() {
  const session = await auth();

  const todos = await db.todo.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  const sortedTodos = await sortTodos(todos);

  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <div className="flex gap-2 items-center">
        <TodoMenu />
        <Breads userId={session?.user?.id ?? ""} ids={[]} />
      </div>
      <TodoList todos={sortedTodos} />
    </div>
  );
}

async function sortTodos(todos: TodoWithChildren[]) {
  const sortedTodos = []
  // sort by order
  todos.sort((a, b) => {
    return a.order - b.order;
  });
  // reset value of order from 1
  for (let i = 0; i < todos.length; i++) {
    const sortedTodo = await db.todo.update({
      where: { id: todos[i].id },
      data: { order: i + 1 },
      include: { children: true },
    });
    sortedTodos.push(sortedTodo);
  }

  return sortedTodos as TodoWithChildren[];
}
