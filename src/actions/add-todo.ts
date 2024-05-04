"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateParent } from "./update-parent";

export async function addTodo(formState: null, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const userId = formData.get("userId") as string;

  const data: any = { title, description, userId };

  const parentId = formData.get("parentId");
  if (parentId) {
    data.parentId = Number(parentId);
  }

  const duration = formData.get("duration");
  if (duration) {
    data.duration = Number(duration);
  }

  const todo = await db.todo.create({ data });
  await db.todo.update({
    where: { id: todo.id },
    data: {
      order: todo.id,
      leafOrder: todo.id,
    },
  });

  if (parentId) {
    const parentList = await updateParent({ parentId: Number(parentId) });
    revalidatePath(`/user/${userId}/todos/${parentList.join("/")}`);
    redirect(`/user/${userId}/todos/${parentList.join("/")}`);
  }

  revalidatePath(`/user/${userId}/todos`);
  redirect(`/user/${userId}/todos`);
}
