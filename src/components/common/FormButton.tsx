'use client';

import { Button } from "@nextui-org/react";
import { useFormStatus } from "react-dom";


interface formButtonProps {
  children: React.ReactNode;
  [key: string]: any;
}

export default function FormButton({ children, ...props }: formButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" {...props}
      isLoading={pending}>
      {children}
    </Button>
  );
}

