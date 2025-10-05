import { IngredientUnit } from "@/types/ingredient-recipe";
import z from "zod";

export const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  code: z.string().optional(),
  unit: z.nativeEnum(IngredientUnit),
  lowStockThreshold: z.coerce.number<number>(),
});

export type IngredientFormValues = z.infer<typeof ingredientSchema>;
