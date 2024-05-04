"use client";

import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react";

interface BreadsProps {
  userId: string;
  ids: { id: string; name: string }[];
}

export default function Breads({ userId, ids }: BreadsProps) {
  return (
    <Breadcrumbs>
      <BreadcrumbItem key="Root" href={`/user/${userId}/todos`}>Root</BreadcrumbItem>
      {ids.map((v, i, a) => (
        <BreadcrumbItem
          key={v.id}
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
