"use server";

import { db } from "@/db";
import { updateParent } from "./update-parent";
import { revalidatePath } from "next/cache";

export async function pauseTodo(_: any, formData: FormData) {
  const id = formData.get("id") as string;
  const todo = await db.todo.findUnique({ where: { id: Number(id) } });
  if (todo) {
    const lastTimestamp = todo.updatedAt.getTime();
    const newTodo = await db.todo.update({
      where: { id: todo.id },
      data: { status: "pause" },
    });
    const newTimestamp = newTodo.updatedAt.getTime();
    const elapsed = newTimestamp - lastTimestamp;
    await db.todo.update({
      where: { id: todo.id },
      data: { timeSpent: todo.timeSpent + elapsed },
    });

    if (todo.parentId) {
      await updateParent({ parentId: todo.parentId, elapsed });
      revalidatePath(`/todo/${todo.parentId}`);
    } else {
      revalidatePath(`/todo`);
    }
  }

  return { message: "Todo paused successfully" };
}
