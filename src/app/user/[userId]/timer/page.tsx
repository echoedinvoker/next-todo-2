import MyStopwatch from "@/components/MyStopwatch";
import { db } from "@/db";
import { sortTodos } from "@/helpers/sort-todos";

export default async function TimerPage() {
  const todos = await db.todo.findMany({
    include: {
      children: true,
    },
  });
  const leaves = todos.filter((todo) => todo.children.length === 0).filter((todo) => todo.status !== "completed")
  await sortTodos(leaves);
  leaves.sort((a) => { return a.status === "in-progress" ? -1 : 1 });

  return (
    <div>
      <MyStopwatch todos={leaves} />
    </div>
  );
}
