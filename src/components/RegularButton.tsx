import { RegularButtonProps } from "@/types";
import { Button } from "@nextui-org/react";

export default function RegularButton({
  children,
  onPress,
  action,
  actionData,
  isDisabled,
  ...props
}: RegularButtonProps) {
  if (onPress) {
    return (
      <Button
        onPress={onPress}
        size="sm"
        variant="shadow"
        isDisabled={!!isDisabled}
        {...props}
      >
        {children}
      </Button>
    );
  }
  if (action) {
    return (
      <form action={action}>
        {actionData &&
          actionData.map(({ name, value }) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
        <Button
          type="submit"
          variant="shadow"
          isDisabled={!!isDisabled}
          size="sm"
          {...props}
        >
          {children}
        </Button>
      </form>
    );
  }
  return null;
}
