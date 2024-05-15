"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateParent } from "./update-parent";

export async function addTodo(_: null, formData: FormData) {
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

  const orders = await db.todo.findMany({
    where: { userId },
    select: { order: true },
  });

  if (orders.length > 0) {
    data.order = orders.reduce((max, { order }) => Math.max(max, order), 0) + 1;
  } else {
    data.order = 1;
  }
  console.log('data.order', data.order);

  const todo = await db.todo.create({ data });
  console.log('todo', todo);

  if (parentId) {
    const parentList = await updateParent({ parentId: Number(parentId) });
    revalidatePath(`/user/${userId}/todos/${parentList.join("/")}`);
    redirect(`/user/${userId}/todos/${parentList.join("/")}`);
  }

  revalidatePath(`/user/${userId}/todos`);
  redirect(`/user/${userId}/todos`);
}
