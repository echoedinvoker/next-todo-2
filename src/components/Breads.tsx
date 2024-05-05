"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

interface BreadsProps {
  userId: string;
  ids: { id: string; name: string }[];
}

export default function Breads({ userId, ids }: BreadsProps) {
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
          console.log("dropped-todo-id", null);
          console.log(
            "dragged-todo-id",
            e.dataTransfer.getData("dragged-todo-id"),
          );
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
            console.log("dropped-todo-id", v.id);
            console.log(
              "dragged-todo-id",
              e.dataTransfer.getData("dragged-todo-id"),
            );
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
