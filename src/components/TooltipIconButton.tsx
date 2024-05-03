import { Button, Tooltip } from "@nextui-org/react";
import Link from "next/link";

interface TooltipIconButtonProps {
  children: React.ReactNode;
  href?: string;
  content?: string;
  onPress?: () => void;
  action?: (payload: FormData) => void;
  hiddenInputData?: { name: string; value: string }[];
}

export default function TooltipIconButton({
  children,
  onPress,
  action,
  content,
  href,
  hiddenInputData,
}: TooltipIconButtonProps) {
  return (
    <Tooltip {...(content && { content })}>
      <span className="text-lg text-info active:opacity-50">
        {action ? (
          <form action={action}>
            {hiddenInputData?.map(({ name, value }) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <Button type="submit" isIconOnly>
              {children}
            </Button>
          </form>
        ) : href ? (
          <Button href={href} as={Link} isIconOnly>
            {children}
          </Button> 
        ) : (
          <Button onClick={onPress} isIconOnly>
            {children}
          </Button>
        )}
      </span>
    </Tooltip>
  );
}
