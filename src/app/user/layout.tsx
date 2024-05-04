import { auth } from "@/auth";
import { redirect } from "next/navigation";


interface VerifyAuthProps {
  children: React.ReactNode;
}

export default async function VerifyAuth({ children }: VerifyAuthProps) {
  const session = await auth();
  if (!session) {
    redirect("/")
  }
  return (
    <>
      {children}
    </>
  );
}
