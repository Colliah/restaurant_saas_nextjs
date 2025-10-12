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
import { Textarea } from "@/components/ui/textarea";
import {
  Ingredient,
  IngredientTransactionType,
} from "@/types/ingredient-recipe";
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

interface SelectedItems extends Ingredient {
  quantity: number;
  price: number;
}

type FormValues = {
  type: IngredientTransactionType;
  notes?: string;
};

export function TransactionForm({ onSuccess }: TransactionFormProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  const [selectedItems, setSelectedItems] = useState<SelectedItems[]>([]);

  const form = useForm<FormValues>({
    defaultValues: {
      type: IngredientTransactionType.IMPORT,
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

  const onSubmit = async (values: FormValues) => {
    if (selectedItems.length === 0) {
      toast.error("Please add at least one ingredient.");
      return;
    }

    const payload = {
      type: values.type,
      notes: values.notes,
      items: selectedItems.map((item) => ({
        ingredientId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const response = await fetch("/api/ingredient-transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      toast.success("Transaction created successfully!");
      form.reset();
      setSelectedItems([]);
      onSuccess?.();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleSelectItem = (ingredientId: string) => {
    const isAlready = selectedItems.some((item) => item.id === ingredientId);
    if (isAlready) {
      toast.info("Item already added");
      return;
    }

    const itemtoAdd = ingredients.find(
      (ingredient) => ingredient.id === ingredientId
    );
    if (itemtoAdd) {
      const newItem: SelectedItems = {
        ...itemtoAdd,
        quantity: 1,
        price: 0,
      };
      setSelectedItems((currentItem) => [...currentItem, newItem]);
    }
  };

  const handleUpdateItem = (
    itemId: string,
    field: "price" | "quantity",
    value: number
  ) => {
    setSelectedItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 px-4 mt-2"
      >
        <FormItem>
          <FormLabel>Ingredient</FormLabel>
          <Select
            onValueChange={handleSelectItem}
            disabled={isLoadingIngredients}
            value=""
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingIngredients
                      ? "Loading..."
                      : "Select an ingredient to add"
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
        </FormItem>
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
        <div className="space-y-3 rounded-md border p-3">
          <h3 className="text-sm font-medium">Items to Transaction</h3>
          {selectedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No ingredients added yet.
            </p>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-x-2 rounded-md border p-2"
                >
                  <span className="flex-1 text-sm">
                    {item.name} {item.code ? `(${item.code})` : ""}
                  </span>

                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>Quantity</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateItem(
                          item.id,
                          "quantity",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                    <InputGroupAddon align="inline-end"></InputGroupAddon>
                  </InputGroup>

                  <InputGroup>
                    <InputGroupAddon>
                      <InputGroupText>$</InputGroupText>
                    </InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        handleUpdateItem(
                          item.id,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupText>USD</InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    X
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>{" "}
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
