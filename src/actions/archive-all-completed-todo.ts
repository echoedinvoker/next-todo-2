"use server";

import { db } from "@/db";
import { updateParent } from "./update-parent";
import { revalidatePath } from "next/cache";

export async function archiveAllCompletedTodos(formData: FormData) {
  const userId = formData.get("userId") as string;

  const completedTodos = await db.todo.findMany({
    where: {
      userId,
      status: "completed",
    },
    include: {
      children: true,
    },
  });
  const completedLeaves = completedTodos.filter((todo) => todo.children.length === 0);
  
  for (const todo of completedLeaves) {
    const updated = await db.todo.update({
      where: { id: todo.id },
      data: {
        status: "archived",
      },
    });

    if (updated.parentId) {
      await updateParent({ parentId: updated.parentId });
    }
  }

  revalidatePath('/');
}
