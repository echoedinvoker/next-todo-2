import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { AcmeLogo } from "@/components/icons/AcmeLogo";
import { auth } from "@/auth";
import { AuthMenu, NavFeatures } from "@/components";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await auth()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container mx-auto px-4 max-w-6xl">
          <Providers>
            <Navbar>
              <NavbarBrand>
                <AcmeLogo />
                <p className="font-bold text-inherit">ACME</p>
              </NavbarBrand>
              <NavFeatures />
              <NavbarContent justify="end">
                <NavbarItem>
                  <AuthMenu session={session} />
                </NavbarItem>
              </NavbarContent>
            </Navbar>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
