import { Avatar, Button, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import RegularButton from "./RegularButton";
import * as actions from "@/actions";

interface AuthMenuProps {
  session: any;
}
export default function AuthMenu({ session }: AuthMenuProps) {
  if (session?.user) {
    return <Popover placement="left">
      <PopoverTrigger>
        <Avatar role="button"
          {...(session.user?.image ? { src: session.user.image } : { name: session.user.name })}
        />
      </PopoverTrigger>
      <PopoverContent>
        <div className="text-center p-2">
          <RegularButton action={actions.signOut}
            color="danger"
          >Sign Out</RegularButton>
        </div>
      </PopoverContent>
    </Popover>
  }
  return <RegularButton action={actions.signIn}>Sign In</RegularButton>
}
