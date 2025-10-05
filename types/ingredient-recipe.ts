export enum IngredientUnit {
  KG = "KG",
  GRAM = "GRAM",
  LITER = "LITER",
  ML = "ML",
  CUP = "CUP",
  PIECE = "PIECE",
}
export enum IngredientTransactionType {
  IMPORT = "IMPORT",
  EXPORT = "EXPORT",
}

export interface Ingredient {
  id: string;
  slug: string;
  name: string;
  code: string | null;
  lowStockThreshold: number | null;
  imageId: string;
  unit: IngredientUnit;
  organizationId: string;
}
export interface IngredientTransaction {
  id: string;
  ingredientId: string;
  type: IngredientTransactionType;
  quantity: number;
  price: number;
  notes: string | null;
  createdById: string | null;
  createdAt: Date;
  organizationId: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  estimatedCost: number | null;
  preparationTime: number | null;
  servingSize: number | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  organizationId: string;
}

export interface RecipeIngredient {
  recipeId: string;
  ingredientId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
