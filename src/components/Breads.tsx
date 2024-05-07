"use client";

import { changeTodoParent } from "@/actions/change-todo-parent";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface BreadsProps {
  userId: string;
  ids: { id: string; name: string }[];
}

export default function Breads({ userId, ids }: BreadsProps) {
  const params = useParams();
  useEffect(() => {
    localStorage.setItem("idsOfTodoPage", JSON.stringify(ids));
  }, [ids]);
  return (
    <Breadcrumbs variant="bordered">
      <BreadcrumbItem
        key="Root"
        href={`/user/${userId}/todos`}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={async (e) => {
          if (ids.length === 0) return;
          const dragTodoId = e.dataTransfer.getData("drag-todo-id")
          changeTodoParent(params, Number(dragTodoId), null);
        }}
      >
        Root
      </BreadcrumbItem>
      {ids.map((v, i, a) => (
        <BreadcrumbItem
          key={v.id}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={async (e) => {
            if (v.id === a.at(-1)!.id) return;
            const dragTodoId = e.dataTransfer.getData("drag-todo-id")
            changeTodoParent(params, Number(dragTodoId), Number(v.id));
          }}
          href={`/user/${userId}/todos/${a
            .map((v) => v.id)
            .slice(0, i + 1)
            .join("/")}`}
        >
          {v.name}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}
