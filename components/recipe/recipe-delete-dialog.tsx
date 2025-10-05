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
import { Recipe } from "@/types/ingredient-recipe";
import { Trash2 } from "lucide-react";
import { useState } from "react";

interface RecipeDeleteDialogProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteConfirm: (id: string) => void;
}

export function RecipeDeleteDialog({
  recipe,
  open,
  onOpenChange,
  onDeleteConfirm,
}: RecipeDeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!recipe) return;

    setIsDeleting(true);
    try {
      await onDeleteConfirm(recipe.id);
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
            This will permanently delete the ingredient:{" "}
            <span className="font-semibold text-foreground">
              {recipe?.name}
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
