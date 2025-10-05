"use client";

import React, { useEffect } from "react";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecipeFormValues, recipeSchema } from "@/schema/recipe";
import { slugify } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "../ui/input-group";
import { Clock } from "lucide-react";
import { toast } from "sonner";
import { Recipe } from "@/types/ingredient-recipe";

type FormMode = "create" | "edit" | "view";

interface RecipeFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialData?: Recipe | null;
  onSuccess: () => void;
  mode: FormMode;
}

export default function RecipeSheetForm({
  isOpen,
  onOpenChange,
  initialData,
  onSuccess,
  mode,
}: RecipeFormProps) {
  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";

  const defaultValues = {
    name: "",
    slug: "",
    description: "",
    estimatedCost: 1,
    preparationTime: 1,
    servingSize: 1,
  };

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeSchema),
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
        description: initialData.description ?? "",
        estimatedCost: initialData.estimatedCost ?? 1,
        preparationTime: initialData.preparationTime ?? 1,
        servingSize: initialData.servingSize ?? 1,
      };
      form.reset(formValues);
    } else {
      form.reset(defaultValues);
    }
  }, [initialData, mode, form, isOpen]);

  const onSubmit = async (values: RecipeFormValues) => {
    try {
      const url = isEditMode ? `/api/recipe/${initialData?.id}` : `/api/recipe`;
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
        `Recipe ${isEditMode ? "updated" : "created"} successfully`
      );
      onOpenChange(false);
      onSuccess();
      console.log(values);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  const titles = {
    create: "Create New Recipe",
    edit: "Edit Recipe",
    view: "Recipe Details",
  };
  const descriptions = {
    create: "Fill in the recipe details below. Click save when you're done.",
    edit: "Update the recipe details below.",
    view: "Here are the details for this recipe.",
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
            <div className="grid grid-cols-2 items-center gap-x-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="shadcn"
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
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="shadcn"
                      {...field}
                      disabled={isViewMode}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 items-center gap-x-4">
              <FormField
                control={form.control}
                name="estimatedCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Cost</FormLabel>
                    <FormControl>
                      <InputGroup>
                        <InputGroupAddon>
                          <InputGroupText>$</InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          type="number"
                          placeholder="0.00"
                          value={field.value ?? ""}
                          disabled={isViewMode}
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
              <FormField
                control={form.control}
                name="preparationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preparation Time</FormLabel>
                    <FormControl>
                      <InputGroup className="items-center justify-between">
                        <InputGroupAddon className="pt-[7.5px]">
                          <InputGroupText>
                            <Clock className="size-4" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <InputGroupInput
                          {...field}
                          type="number"
                          placeholder="0.00"
                          value={field.value ?? ""}
                          disabled={isViewMode}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupText>minutes</InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="servingSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serving Size</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" disabled={isViewMode} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isViewMode && (
              <SheetFooter className="p-0 pt-4">
                <Button
                  type="submit"
                  className="p-0"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Saving..."
                    : isEditMode
                      ? "Save Changes"
                      : "Create Recipe"}
                </Button>
              </SheetFooter>
            )}
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
