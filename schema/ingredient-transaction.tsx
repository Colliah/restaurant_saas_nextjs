import { IngredientTransactionType } from "@/types/ingredient-recipe";
import z from "zod";

const transactionItemSchema = z.object({
  ingredientId: z.string().min(1),
  quantity: z.coerce.number<number>(),
  price: z.coerce.number().min(0),
});

export const ingredientTransactionSchema = z.object({
  type: z.nativeEnum(IngredientTransactionType),
  notes: z.string().optional(),
  items: z.array(transactionItemSchema).min(1),
});

export type IngredientTransactionFormValues = z.infer<
  typeof ingredientTransactionSchema
>;
