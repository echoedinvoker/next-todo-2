"use server";

import { revalidatePath } from "next/cache";
import { updateParent } from "./update-parent";
import { db } from "@/db";

export async function playTodo(_: any, formData: FormData) {
  const id = formData.get("id") as string;
  const pathname = formData.get("pathname") as string;
  const todo = await db.todo.findUnique({ where: { id: Number(id) } });
  const otherInProgressTodos = await db.todo.findMany({
    where: { id: { not: Number(id) }, status: "in-progress" },
  });
  if (otherInProgressTodos.length > 0) {
    for (const t of otherInProgressTodos) {
      await db.todo.update({ where: { id: t.id },
        data: {
          status: "pause",
          timeSpent: t.timeSpent + Date.now() - t.updatedAt.getTime(),
        } });
      if (t.parentId) {
        await updateParent({ parentId: t.parentId });
      }
    }
  }
  if (todo) {
    await db.todo.update({
      where: { id: todo.id },
      data: { status: "in-progress" },
    });
    if (todo.parentId) {
      await updateParent({ parentId: todo.parentId });
    }
    revalidatePath(pathname);
  }

  return { message: "Todo started successfully" };
}
