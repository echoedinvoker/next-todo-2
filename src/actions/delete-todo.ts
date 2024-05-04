'use server'

import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { updateParent } from "./update-parent"
import { redirect } from "next/navigation"

export async function deleteTodo(id: number, userId: string) {
  const currentTodo = await db.todo.findUnique({ where: { id } })
  const parentId = currentTodo?.parentId
  await deleteChildren(id)
  await db.todo.delete({ where: { id } })
  if (parentId) {
    const parentList = await updateParent({ parentId })
    const parent = await db.todo.findUnique({
      where: { id: parentId },
      include: { children: true },
    })
    if (parent && parent.children.length === 0) {
      redirect(`/user/${userId}/todos/${parentList.slice(0, -1).join("/")}`)
    }
    revalidatePath(`/user/${userId}/todos/${parentList.join("/")}`)
  }
  revalidatePath(`/user/${userId}/todos`)
}

async function deleteChildren(id: number) {
  const children = await db.todo.findMany({ where: { parentId: id } })

  for (const child of children) {
    await deleteChildren(child.id)
  }

  await db.todo.deleteMany({ where: { parentId: id } })
}

