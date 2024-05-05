import { TodoList } from "@/components";
import { db } from "@/db";


interface LeavesPageProps {
  params: { userId: string };
}

export default async function leavesPage({ params }: LeavesPageProps) {
  const todos = await db.todo.findMany({
    where: { userId: params.userId },
    include: { children: true },
 });
  const leaves = todos.filter((todo) => todo.children.length === 0);
  const sortedLeaves = leaves.sort((a, b) => (a.leafOrder ?? 0) - (b.leafOrder ?? 0));
  return (
    <div className="flex flex-col justify-center py-2 gap-2">
    <TodoList todos={sortedLeaves} />
    </div>
  );
}
