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
  return (
    <div className="flex flex-col justify-center py-2 gap-2">
    <TodoList todos={leaves} isLeaves />
    </div>
  );
}
