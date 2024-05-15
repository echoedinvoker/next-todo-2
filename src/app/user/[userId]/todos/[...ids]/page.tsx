import TodoList from "@/components/TodoList";
import { sortTodos } from "@/helpers/sort-todos";

interface TodoListPageProps {
  params: {
    userId: string;
    ids: string[];
  };
}

export default async function TodoListPage({ params }: TodoListPageProps) {
  const sortedTodos = await sortTodos(params.userId);
  const { ids } = params;
  const todos = sortedTodos.filter((todo) => todo.parentId === Number(ids.at(-1)!));

  return <TodoList todos={todos} />;
}
