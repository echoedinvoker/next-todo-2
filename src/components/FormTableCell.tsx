'use client';

import { TableCell } from "@nextui-org/react";
import { useFormStatus } from "react-dom";

interface FormTableCellProps {
  children: React.ReactNode;
}

export default function FormTableCell({ children }: FormTableCellProps) {
  const { pending } = useFormStatus();
  return <TableCell
    className={pending ? "animate-pulse" : ""}
  >{children}</TableCell>;
}
