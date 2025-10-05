"use client";

import RecipeSheetForm from "@/components/recipe/recipe-form";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { Recipe } from "@/types/ingredient-recipe";
import { toast } from "sonner";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { RecipeDeleteDialog } from "@/components/recipe/recipe-delete-dialog";

type FormMode = "create" | "edit" | "view";

export default function Page() {
  const [recipe, setRecipe] = useState<Recipe[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [formMode, setFormMode] = useState<FormMode>("create");

  const fetchRecipe = async () => {
    try {
      const apiUrl = `${window.location.origin}/api/recipe`;

      const res = await fetch(apiUrl, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setRecipe(data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu recipe:", err);
    }
  };
  useEffect(() => {
    fetchRecipe();
  }, []);

  const handleOpenDeleteDialog = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDeleteDialogOpen(true);
  };

  const handleViewDetails = (recipe: Recipe) => {
    setFormMode("view");
    setSelectedRecipe(recipe);
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/recipe/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message);
      }
      toast.success("Deleted recipe successfully");
      fetchRecipe();
    } catch (error) {
      toast.error(`Deleted recipe failed: ${error}`);
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedRecipe(null);
    }
  };

  const handleAddNew = () => {
    setFormMode("create");
    setSelectedRecipe(null);
    setIsSheetOpen(true);
  };

  const handleEdit = (recipe: Recipe) => {
    setFormMode("edit");
    setSelectedRecipe(recipe);
    setIsSheetOpen(true);
  };

  return (
    <div>
      <Button onClick={() => handleAddNew()}>Add New Recipe</Button>
      {recipe.map((recipe) => (
        <div key={recipe.id}>
          {recipe.name}-{recipe.slug}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewDetails(recipe)}
            title="View Details"
          >
            <Eye className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(recipe)}
            title="Update"
          >
            <Pencil className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenDeleteDialog(recipe)}
            title="Delete Ingredient"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      ))}
      <RecipeSheetForm
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        mode={formMode}
        initialData={selectedRecipe}
        onSuccess={() => {
          fetchRecipe();
          setSelectedRecipe(null);
        }}
      />
      <RecipeDeleteDialog
        recipe={selectedRecipe}
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setSelectedRecipe(null);
          }
        }}
        onDeleteConfirm={handleDelete}
      />
    </div>
  );
}
