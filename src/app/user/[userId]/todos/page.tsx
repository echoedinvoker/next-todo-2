import { auth } from "@/auth";
import { TodoList, TodoMenu } from "@/components";
import Breads from "@/components/Breads";
import { timeFormatter } from "@/helpers";
import { sortTodos } from "@/helpers/sort-todos";

export default async function TodoListPage() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const sortedTodos = await sortTodos(session.user?.id)
  const leaves = sortedTodos.filter((todo) => todo.children.length === 0);

  const todos = sortedTodos.filter((todo) => todo.parentId === null)

  const todosWithDuration = todos.map((todo) => {
    const totalDuration = leaves.reduce((acc: any, leaf: any) => {
      if (checkParent(sortedTodos, todo, leaf)) {
        return acc + leaf.duration;
      } else {
        return acc;
      }
    }, 0);
    const totalArchivedDuration = leaves.filter((leaf) => leaf.status === "archived").reduce((acc: any, leaf: any) => {
      if (checkParent(sortedTodos, todo, leaf)) {
        return acc + leaf.duration;
      } else {
        return acc;
      }
    }, 0);
    const totalCompletedDuration = leaves.filter((leaf) => leaf.status === "completed").reduce((acc: any, leaf: any) => {
      if (checkParent(sortedTodos, todo, leaf)) {
        return acc + leaf.duration;
      } else {
        return acc;
      }
    }, 0);

    return { ...todo, totalDuration: timeFormatter({ milliseconds: totalDuration }), totalArchivedDuration: timeFormatter({ milliseconds: totalArchivedDuration }), totalCompletedDuration: timeFormatter({ milliseconds: totalCompletedDuration }) };
  })



  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <div className="flex gap-2 items-center">
        <TodoMenu />
        <Breads userId={session?.user?.id ?? ""} ids={[]} />
      </div>
      <TodoList todos={todosWithDuration} />
    </div>
  );
}


function checkParent(todos: any, todo: any, leaf: any) {
  if (!leaf.parentId) {
    return false;
  }

  if (todo.id === leaf.parentId) {
    return true;
  }

  const parent = todos.find((t: any) => t.id === leaf.parentId);
  return checkParent(todos, todo, parent);
}
