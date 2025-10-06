"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Ingredient,
  IngredientTransactionType,
} from "@/types/ingredient-recipe";
import {
  IngredientTransactionFormValues,
  ingredientTransactionSchema,
} from "@/schema/ingredient-transaction";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface TransactionFormProps {
  onSuccess?: () => void;
}

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);

  const form = useForm<IngredientTransactionFormValues>({
    resolver: zodResolver(ingredientTransactionSchema),
    defaultValues: {
      ingredientId: "",
      type: IngredientTransactionType.IMPORT,
      quantity: 1,
      price: 0,
      notes: "",
    },
  });

  useEffect(() => {
    const fetchIngredients = async () => {
      setIsLoadingIngredients(true);
      try {
        const res = await fetch("/api/ingredient");
        if (!res.ok) throw new Error("Failed to fetch ingredients");
        const data = await res.json();
        setIngredients(data);
      } catch (error) {
        console.error(error);
        toast.error("Could not load ingredients.");
      } finally {
        setIsLoadingIngredients(false);
      }
    };
    fetchIngredients();
  }, []);

  const onSubmit = async (values: IngredientTransactionFormValues) => {
    try {
      const response = await fetch("/api/ingredient-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      toast.success("Transaction created successfully!");
      form.reset();
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 mt-2"
      >
        <FormField
          control={form.control}
          name="ingredientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingredient</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoadingIngredients}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingIngredients
                          ? "Loading..."
                          : "Select an ingredient"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {!isLoadingIngredients &&
                    ingredients.map((ingredient) => (
                      <SelectItem key={ingredient.id} value={ingredient.id}>
                        {ingredient.name}{" "}
                        {ingredient.code ? `(${ingredient.code})` : ""}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(IngredientTransactionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-x-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="0"
                    // Chuyển đổi giá trị về number khi onChange
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      {...field}
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      // Chuyển đổi giá trị về number khi onChange
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>USD</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
          disabled={form.formState.isSubmitting || isLoadingIngredients}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit Transaction"}
        </Button>
      </form>
    </Form>
  );
}
