"use client";

import { changeTodoParent } from "@/actions/change-todo-parent";
import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";
import { useParams } from "next/navigation";

interface BreadsProps {
  userId: string;
  ids: { id: string; name: string }[];
}

export default function Breads({ userId, ids }: BreadsProps) {
  const params = useParams();
  return (
    <Breadcrumbs variant="bordered">
      <BreadcrumbItem
        key="Root"
        href={`/user/${userId}/todos`}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={async (e) => {
          e.preventDefault();
          if (ids.length === 0) return;
          changeTodoParent(params, Number(e.dataTransfer.getData("dragged-todo-id")), null);
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
            e.preventDefault();
            if (v.id === a.at(-1)!.id) return;
            changeTodoParent(params, Number(e.dataTransfer.getData("dragged-todo-id")), Number(v.id));
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
