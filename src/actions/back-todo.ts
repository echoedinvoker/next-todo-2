"use server";

import { db } from "@/db";
import { redirect } from "next/navigation";


export async function backTodo( _: any, formData: FormData) {
  const id = Number(formData.get("id"))
  const todo = await db.todo.findUnique({ where: { id } })
  if (todo?.parentId) {
    return redirect(`/todo/${todo.parentId}`)
  }
  return redirect("/todo")
}
