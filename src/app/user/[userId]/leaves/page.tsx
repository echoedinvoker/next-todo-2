import { getParentTitleAndIds } from "@/actions";
import { TodoList } from "@/components";
import { sortTodos } from "@/helpers/sort-todos";

interface LeavesPageProps {
  params: { userId: string };
}

export default async function leavesPage({ params }: LeavesPageProps) {
  const todos = await sortTodos(params.userId);
  const leaves = todos.filter((todo) => todo.children.length === 0).filter((todo) => todo.status !== "archived");
  for (const leaf of leaves) {
    leaf.parentList = await getParentTitleAndIds(leaf.parentId);
  }
  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <TodoList todos={leaves} isLeaves />
    </div>
  );
}
