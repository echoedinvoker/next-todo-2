"use client";

import { NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function NavFeatures() {
  const pathname = usePathname();
  const params = useParams();
  return (
    <NavbarContent justify="center">
      <NavbarItem isActive={pathname.includes("todos")}>
        {pathname.includes("todos") ? (
          <div>Todos</div>
        ) : (
          <Link href={`/user/${params.userId}/todos`}>Todos</Link>
        )}
      </NavbarItem>
      <NavbarItem isActive={pathname.includes("leaves")}>
        {pathname.includes("leaves") ? (
          <div>Leaves</div>
        ) : (
          <Link href={`/user/${params.userId}/leaves`}>Leaves</Link>
        )}
      </NavbarItem>
      <NavbarItem isActive={pathname.includes("timer")}>
        {pathname.includes("timer") ? (
          <div>Timer</div>
        ) : (
          <Link href={`/user/${params.userId}/timer`}>Timer</Link>
        )}
      </NavbarItem>
    </NavbarContent>
  );
}