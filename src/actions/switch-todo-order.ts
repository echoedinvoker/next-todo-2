"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function switchTodoOrder(params: any, a: any, b: any) {
  const todoA = await db.todo.findUnique({ where: { id: Number(a) } });
  const todoB = await db.todo.findUnique({ where: { id: Number(b) } });
  if (!todoA || !todoB) {
    throw new Error("Todos not found");
  }

  await db.todo.update({
    where: { id: Number(a) },
    data: { order: todoB.order },
  });

  await db.todo.update({
    where: { id: Number(b) },
    data: { order: todoA.order },
  });

  revalidatePath(`/user/${params.userId}/todos/${params.ids.join("/")}`);
}
