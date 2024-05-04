import { RegularButtonProps } from "@/types";
import { Button } from "@nextui-org/react";

export default function RegularButton({
  children,
  onPress,
  action,
  actionData,
  isDisabled,
}: RegularButtonProps) {
  if (onPress) {
    return (
      <Button
        onPress={onPress}
        size="sm"
        variant="shadow"
        style={{ width: "10%" }}
        isDisabled={!!isDisabled}
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
          style={{ width: "10%" }}
        >
          {children}
        </Button>
      </form>
    );
  }
  return null;
}
