import TodoList from "@/components/TodoList";
import { timeFormatter } from "@/helpers";
import { sortTodos } from "@/helpers/sort-todos";

interface TodoListPageProps {
  params: {
    userId: string;
    ids: string[];
  };
}

export default async function TodoListPage({ params }: TodoListPageProps) {
  const sortedTodos = await sortTodos(params.userId);
  const leaves = sortedTodos.filter((todo) => todo.children.length === 0);
  const { ids } = params;
  const todos = sortedTodos.filter((todo) => todo.parentId === Number(ids.at(-1)!)).filter((todo) => todo.status !== "archived");
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

  return <TodoList todos={todosWithDuration} />;
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
