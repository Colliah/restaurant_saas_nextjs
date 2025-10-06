import { IngredientTransactionType } from "@/types/ingredient-recipe";
import z from "zod";

export const ingredientTransactionSchema = z.object({
  ingredientId: z.string().min(1, "Ingredient is required"),
  type: z.nativeEnum(IngredientTransactionType),
  quantity: z.coerce.number<number>(),
  price: z.coerce.number<number>(),
  notes: z.string().optional(),
});

export type IngredientTransactionFormValues = z.infer<
  typeof ingredientTransactionSchema
>;
