"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function switchLeafOrder(params: any, todoIdA: number, todoIdB: number) {
  console.log("switchLeafOrder", todoIdA, todoIdB);
  const todoA = await db.todo.findUnique({ where: { id: todoIdA } });
  const todoB = await db.todo.findUnique({ where: { id: todoIdB } });
  if (!todoA || !todoB) {
    throw new Error("Leaves not found");
  }

  await db.todo.update({
    where: { id: todoIdA },
    data: { leafOrder: todoB.leafOrder },
  });

  await db.todo.update({
    where: { id: todoIdB },
    data: { leafOrder: todoA.leafOrder },
  });

  revalidatePath(`/user/${params.userId}/leaves`);
}
