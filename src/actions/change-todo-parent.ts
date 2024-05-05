"use server";

import { db } from "@/db";
import { updateParent } from "./update-parent";
import { revalidatePath } from "next/cache";

export async function changeTodoParent(params: any, id: number, parentId: number | null) {  //only lift up
  const todo = await db.todo.findUnique({
    where: { id },
  });

  await db.todo.update({
    where: { id },
    data: { parentId },
  });

  if (todo?.parentId) {
    await updateParent({ parentId: todo.parentId });
  }

  revalidatePath(`/user/${params.userId}/todos/${params.ids.join("/")}`);
}
