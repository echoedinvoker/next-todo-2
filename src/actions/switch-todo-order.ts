"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function switchTodoOrder(params: any, dragTodoId: number, dropTodoId: number) {
  console.log('dragTodoId', dragTodoId)
  console.log('dropTodoId', dropTodoId)
  const dragTodo = await db.todo.findUnique({
    where: { id: dragTodoId },
    select: { id: true, order: true, updatedAt: true }
  });

  const dropTodo = await db.todo.findUnique({
    where: { id: dropTodoId },
    select: { id: true, order: true, updatedAt: true }
  });

  if (!dragTodo || !dropTodo) {
    throw new Error("Todos not found");
  }

  if (dragTodo.order < dropTodo.order) {
    await db.todo.update({
      where: { id: dragTodoId },
      data: { order: dropTodo.order + 0.5, updatedAt: dragTodo.updatedAt }
    });
  } else {
    await db.todo.update({
      where: { id: dragTodoId },
      data: { order: dropTodo.order - 0.5, updatedAt: dragTodo.updatedAt }
    });
  }

  if (params.ids) {
    revalidatePath(`/user/${params.userId}/todos/${params.ids.join("/")}`);
  } else {
    revalidatePath(`/user/${params.userId}/todos`);
  }
  revalidatePath(`/user/${params.userId}/leaves`);
}
