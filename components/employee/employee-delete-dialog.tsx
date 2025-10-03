"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmployeeData } from "@/types/employee";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface EmployeeDeleteDialogProps {
  employee: EmployeeData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteConfirm: (id: string) => void;
}

export function EmployeeDeleteDialog({
  employee,
  open,
  onOpenChange,
  onDeleteConfirm,
}: EmployeeDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!employee) return;

    setIsDeleting(true);
    try {
      await onDeleteConfirm(employee.id);
    } finally {
      setIsDeleting(false);
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="size-5 text-red-500" />
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the employee{" "}
            <span className="font-semibold text-foreground">
              {employee?.user?.name}{" "}
            </span>
            belongs to
            <span className="font-semibold text-foreground">
              {" "}
              {employee?.organization?.name}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
