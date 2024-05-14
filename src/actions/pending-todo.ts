"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function pendingTodo(_: any, formData: FormData) {
  const id = formData.get("id") as string;
  const todo = await db.todo.findUnique({ where: { id: Number(id) } });
  if (!todo) {
    return { message: "Todo not found" };
  }

  await db.todo.update({
    where: { id: todo.id },
    data: {
      status: todo.status === "not-started" ? "pending" : "not-started",
    },
  });

  revalidatePath(`/todo`);
  return { message: "Todo completed successfully" };
}
