"use server";

import { db } from "@/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function switchLeafOrder(params: any, todoIdA: number, todoIdB: number) {
  const todoA = await db.todo.findUnique({
    where: { id: todoIdA },
    select: { id: true, leafOrder: true, updatedAt: true }
  });

  const todoB = await db.todo.findUnique({
    where: { id: todoIdB },
    select: { id: true, leafOrder: true, updatedAt: true }
  });

  if (!todoA || !todoB) {
    throw new Error("Leaves not found");
  }

  const updateDataA: Prisma.TodoUpdateInput = {
    leafOrder: todoB.leafOrder,
    updatedAt: todoA.updatedAt // 保持原有的 updatedAt 值
  };

  const updateDataB: Prisma.TodoUpdateInput = {
    leafOrder: todoA.leafOrder,
    updatedAt: todoB.updatedAt // 保持原有的 updatedAt 值
  };

  await db.$transaction([
    db.todo.update({ where: { id: todoIdA }, data: updateDataA }),
    db.todo.update({ where: { id: todoIdB }, data: updateDataB })
  ]);

  revalidatePath(`/user/${params.userId}/leaves`);
}
