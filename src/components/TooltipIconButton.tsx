import { Button, Tooltip } from "@nextui-org/react";
import Link from "next/link";
import FormButton from "./common/FormButton";

interface TooltipIconButtonProps {
  children: React.ReactNode;
  href?: string;
  content?: string;
  onPress?: () => void;
  action?: (payload: FormData) => void;
  hiddenInputData?: { name: string; value: string }[];
  [key: string]: any;
}

export default function TooltipIconButton({
  children,
  onPress,
  action,
  content,
  href,
  hiddenInputData,
  ...props
}: TooltipIconButtonProps) {
  return (
    <Tooltip {...(content && { content })}>
      <span className="text-lg text-info active:opacity-50">
        {action ? (
          <form action={action}>
            {hiddenInputData?.map(({ name, value }) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <FormButton {...props} isIconOnly>
              {children}
            </FormButton>
          </form>
        ) : href ? (
          <Button href={href} as={Link} {...props} isIconOnly>
            {children}
          </Button>
        ) : (
          <Button onClick={onPress} {...props} isIconOnly>
            {children}
          </Button>
        )}
      </span>
    </Tooltip>
  );
}
