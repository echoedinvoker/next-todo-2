import Timer from "@/components/Timer";
import { db } from "@/db";

interface TimerPageProps {
  params: { id: string };
}

export default async function TimerPage({ params }: TimerPageProps) {
  const todo = await db.todo.findUnique({
    where: {
      id: Number(params.id),
    },
    include: {
      children: true,
    },
  });

  if (!todo) {
    return null;
  }

  return <Timer todo={todo} />;
}
