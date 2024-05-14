import { getParentTitleAndIds } from "@/actions";
import { TodoList } from "@/components";
import { db } from "@/db";
import { sortTodos } from "@/helpers/sort-todos";
import { TodoWithChildren } from "@/types";


interface LeavesPageProps {
  params: { userId: string };
}

export default async function leavesPage({ params }: LeavesPageProps) {
  const todos: TodoWithChildren[] = await db.todo.findMany({
    where: { userId: params.userId },
    include: { children: true },
 });
  const leaves = todos.filter((todo) => todo.children.length === 0)
    .filter((todo) => todo.status !== "completed")
    .filter((todo) => todo.status !== "pending");

  for (const leaf of leaves) {
    leaf.parentList = await getParentTitleAndIds(leaf.parentId);
  }

  await sortTodos(leaves);

  return (
    <div className="flex flex-col justify-center py-2 gap-2">
    <TodoList todos={leaves} isLeaves />
    </div>
  );
}
