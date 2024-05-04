import { auth } from "@/auth";
import Breads from "@/components/Breads";
import { db } from "@/db";
import { redirect } from "next/navigation";

interface TodoLayoutProps {
  children: React.ReactNode;
  params: { userId: string; ids: string[] };
}

export default async function TodoLayout({
  children,
  params,
}: TodoLayoutProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }

  const idsWithTodoNames = await Promise.all(
    params.ids.map(async (id) => {
      const todo = await db.todo.findUnique({ where: { id: Number(id) } });
      return { id, name: todo?.title ?? id };
    }),
  );

  return (
    <div className="flex flex-col justify-center py-2 gap-2">
      <Breads userId={session.user.id} ids={idsWithTodoNames} />
      {children}
    </div>
  );
}
