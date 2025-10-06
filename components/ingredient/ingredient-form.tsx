"use client";

import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { IngredientFormValues, ingredientSchema } from "@/schema/ingredient";
import { Ingredient, IngredientUnit } from "@/types/ingredient-recipe";
import { slugify } from "@/lib/utils";

type FormMode = "create" | "edit" | "view";

interface IngredientSheetFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Ingredient | null;
  onSuccess: () => void;
  mode: FormMode;
}

export function IngredientSheetForm({
  isOpen,
  onOpenChange,
  initialData,
  onSuccess,
  mode,
}: IngredientSheetFormProps) {
  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";

  const defaultValues = {
    name: "",
    slug: "",
    code: "",
    currentStock: 0,
    unit: IngredientUnit.GRAM,
    lowStockThreshold: 10,
  };
  const form = useForm<IngredientFormValues>({
    resolver: zodResolver(ingredientSchema),
    defaultValues,
  });

  const watchedName = form.watch("name");

  useEffect(() => {
    if (watchedName && !isViewMode) {
      const slug = slugify(watchedName);
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchedName, form, isViewMode]);

  useEffect(() => {
    if ((isEditMode || isViewMode) && initialData) {
      const formValues = {
        ...initialData,
        lowStockThreshold: initialData.lowStockThreshold ?? 0,
        code: initialData.code ?? "",
      };
      form.reset(formValues);
    } else {
      form.reset(defaultValues);
    }
  }, [initialData, mode, form, isOpen]);

  const onSubmit = async (values: IngredientFormValues) => {
    try {
      const url = isEditMode
        ? `/api/ingredient/${initialData?.id}`
        : "/api/ingredient";
      const method = isEditMode ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      toast.success(
        `Ingredient ${isEditMode ? "updated" : "created"} successfully!`
      );
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const titles = {
    create: "Create New Ingredient",
    edit: "Edit Ingredient",
    view: "Ingredient Details",
  };
  const descriptions = {
    create:
      "Fill in the ingredient details below. Click save when you're done.",
    edit: "Update the ingredient details below.",
    view: "Here are the details for this ingredient.",
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{titles[mode]}</SheetTitle>
          <SheetDescription>{descriptions[mode]}</SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 px-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter name"
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isEditMode || isViewMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SKU-12345"
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isViewMode}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(IngredientUnit).map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
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
              name="currentStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isEditMode || isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lowStockThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      disabled={isEditMode || isViewMode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isViewMode && (
              <SheetFooter className="p-0 pt-4">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Create Ingredient"}
                </Button>
              </SheetFooter>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
