"use server";

import { db } from "@/db";
import { switchLeafOrder } from "./switch-leaf-order";

export async function switchLeafOrderJumpDown(params: any, id: number, filteringStatusGroup: string[]) {
  const todos = await db.todo.findMany({
    where: { userId: params.userId },
    include: { children: true },
  });
  const leaves = todos.filter((todo) => todo.children.length === 0);
  leaves.sort((a, b) => (a.leafOrder ?? 0) - (b.leafOrder ?? 0));
  const filteredLeaves = leaves.filter((todo) => {
    if (filteringStatusGroup.length === 0) return true;
    return filteringStatusGroup.includes(todo.status);
  })
  const index = filteredLeaves.findIndex((todo) => todo.id === id);
  if (index === filteredLeaves.length - 1) return;
  const downId = filteredLeaves[index + 1].id;
  await switchLeafOrder(params, id, downId);
}

