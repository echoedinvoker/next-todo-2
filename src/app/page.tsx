import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  if (session) {
    redirect(`/user/${session.user?.id}/todos`)
  }

  return (
    <div>Hello, please sign in.</div>
  );
}
