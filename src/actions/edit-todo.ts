'use server'

import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { updateParent } from "./update-parent"

export async function editTodo(formState: { message: string }, formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const duration = formData.get("duration") as string
  const timeSpentMin = formData.get("timeSpentMin") as string
  const oldTimeSpent = formData.get("oldTimeSpent") as string

  const data: any = { title, description, timeSpent: Number(timeSpentMin) * 60 * 1000 }
  if (duration) { data.duration = Number(duration) }

  const updatedTodo = await db.todo.update({ where: { id: Number(id) }, data })

  if (updatedTodo.parentId) {
    await updateParent({ parentId: updatedTodo.parentId, elapsed: updatedTodo.timeSpent - Number(oldTimeSpent)})
    revalidatePath(`/todo/${updatedTodo.parentId}`)
  } else {
    revalidatePath(`/todo`)
  }
  return { message: "Todo updated successfully" }
}
