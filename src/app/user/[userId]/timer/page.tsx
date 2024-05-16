import { getParentTitleAndIds } from "@/actions";
import MyStopwatch from "@/components/MyStopwatch";
import { sortTodos } from "@/helpers/sort-todos";
import { TodoWithChildren } from "@/types";

interface TimerPageProps {
  params: { userId: string };
}

export default async function TimerPage({ params }: TimerPageProps) {
  const todos = await sortTodos(params.userId);
  const leaves = todos.filter((todo) => todo.children.length === 0)
    .filter((todo) => todo.status !== "completed")
    .filter((todo) => todo.status !== "archived")
    .filter((todo) => todo.status !== "pending") as TodoWithChildren[];
  leaves.sort((a) => { return a.status === "in-progress" ? -1 : 1 });

  for (const leaf of leaves) {
    leaf.parentList = await getParentTitleAndIds(leaf.parentId);
  }

  return (
    <div>
      <MyStopwatch todos={leaves} />
    </div>
  );
}
