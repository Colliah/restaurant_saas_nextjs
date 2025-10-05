import z from "zod";

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  estimatedCost: z.coerce.number<number>(),
  preparationTime: z.coerce.number<number>(),
  servingSize: z.coerce.number<number>(),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;
