export interface RegularButtonProps {
  children: React.ReactNode;
  actionData?: { name: string; value: string }[];
  isDisabled?: boolean;
  onPress?: () => void;
  action?: (payload: FormData) => void;
}
