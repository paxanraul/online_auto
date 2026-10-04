"use client";
import * as A from "@radix-ui/react-alert-dialog";
export const AlertDialog = A.Root;
export const AlertDialogTrigger = A.Trigger;
export const AlertDialogCancel = A.Cancel;
export const AlertDialogAction = A.Action;
export const AlertDialogTitle = A.Title;
export const AlertDialogDescription = A.Description;
export function AlertDialogContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <A.Portal>
      <A.Overlay className="dialog-overlay" />
      <A.Content className="dialog-content confirm-dialog">
        {children}
      </A.Content>
    </A.Portal>
  );
}
