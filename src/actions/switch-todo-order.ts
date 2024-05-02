"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function switchTodoOrder(a: any, b: any) {
  console.log("switchTodoOrder", a, b);
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

  if (todoA.parentId) {
    revalidatePath(`/todo/${todoA.parentId}`);
  } else {
    revalidatePath("/todo");
  }
}
