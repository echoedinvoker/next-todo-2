"use server";

import { db } from "@/db";
import { updateParent } from "./update-parent";
import { revalidatePath } from "next/cache";

export async function archiveTodo(formData: FormData) {
  const id = formData.get("id") as string;
  const todo = await db.todo.findUnique({ where: { id: Number(id) } });
  if (!todo) {
    throw new Error("Todo not found");
  }

  await db.todo.update({
    where: { id: todo.id },
    data: {
      status: "archived",
    },
  });

  if (todo.parentId) {
    await updateParent({ parentId: todo.parentId });
    revalidatePath(`/todo/${todo.parentId}`);
  } else {
    revalidatePath(`/todo`);
  }
}
