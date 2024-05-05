'use server'

import { db } from "@/db"


export async function getParentTitleAndIds(parentId: number | null, parentList: Array<{ id: number, title: string }> = []) {
  if (!parentId) {
    return []
  }
  const parent = await db.todo.findUnique({
    where: { id: parentId },
  })
  if (parent) {
    parentList.unshift({ id: parent.id, title: parent.title })
    if (parent.parentId) {
      return getParentTitleAndIds(parent.parentId, parentList)
    }
    return parentList
  }
  return []
}

