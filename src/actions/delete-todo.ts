'use server'

import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { updateParent } from "./update-parent"
import { redirect } from "next/navigation"

export async function deleteTodo(id: number) {
  const currentTodo = await db.todo.findUnique({ where: { id } })
  const parentId = currentTodo?.parentId
  await deleteChildren(id)
  await db.todo.delete({ where: { id } })
  if (parentId) {
    console.log("parent id", parentId)
    await updateParent({ parentId })
    const parent = await db.todo.findUnique({
      where: { id: parentId },
      include: { children: true },
    })
    if (parent && parent.children.length === 0) {
      revalidatePath(`/todo/${parent.parentId ?? ""}`)
      redirect(`/todo/${parent.parentId ?? ""}`)
    }
    revalidatePath(`/todo/${parentId}`)
  }
  revalidatePath("/todo")
}

async function deleteChildren(id: number) {
  const children = await db.todo.findMany({ where: { parentId: id } })

  for (const child of children) {
    await deleteChildren(child.id)
  }

  await db.todo.deleteMany({ where: { parentId: id } })
}

