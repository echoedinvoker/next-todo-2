"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function switchTodoOrder(params: any, todoIdA: number, todoIdB: number) {
  console.log("switchTodoOrder", todoIdA, todoIdB);
  const todoA = await db.todo.findUnique({ where: { id: todoIdA } });
  const todoB = await db.todo.findUnique({ where: { id: todoIdB } });
  if (!todoA || !todoB) {
    throw new Error("Todos not found");
  }

  await db.todo.update({
    where: { id: todoIdA },
    data: { order: todoB.order },
  });

  await db.todo.update({
    where: { id: todoIdB },
    data: { order: todoA.order },
  });

  revalidatePath(`/user/${params.userId}/todos/${params.ids.join("/")}`);
}
