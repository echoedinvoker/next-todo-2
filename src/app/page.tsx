import { signIn } from "@/actions/sign-in";
import { signOut } from "@/actions/sign-out";
import { auth } from "@/auth";
import { Button } from "@nextui-org/react";

export default async function Home() {
  const session = await auth()

  return (
    <div>
      <form action={signIn}>
        <Button type="submit">Sign in</Button>
      </form>
      <form action={signOut}>
        <Button type="submit">Sign out</Button>
      </form>

      {session ? (
        <div>
          <h1>Session</h1>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </div>
      ) : (
        <div>
          <h1>No session</h1>
        </div>
      )}
    </div>
  );
}
