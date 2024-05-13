'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { AuthMenu, NavFeatures } from "@/components";
import { AcmeLogo } from "@/components/icons/AcmeLogo";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const session = useSession()
  const path = usePathname()

  //if (path.includes("timer")) return null

  return (
    <Navbar>
      <NavbarBrand>
        <AcmeLogo />
        <p className="font-bold text-inherit">ACME</p>
      </NavbarBrand>
      <NavFeatures />
      <NavbarContent justify="end">
        <NavbarItem>
          <AuthMenu session={session.data} />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
