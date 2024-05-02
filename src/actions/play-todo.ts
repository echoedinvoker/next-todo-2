'use server'

import { revalidatePath } from "next/cache"
import { updateParent } from "./update-parent"
import { db } from "@/db"

export async function playTodo(_:any, formData: FormData) {
  const id = formData.get("id") as string
  const todo = await db.todo.findUnique({ where: { id: Number(id) } })
  if (todo) {
    await db.todo.update({ where: { id: todo.id }, data: { status: "in-progress" } })
    if (todo.parentId) {
      await updateParent({ parentId: todo.parentId })
      revalidatePath(`/todo/${todo.parentId}`)
    }
    revalidatePath(`/todo`)
  }

  return { message: "Todo started successfully" }
}
