"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Info } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { createOrganization } from "@/lib/actions/organization-actions";
import {
  organizationFormValue,
  organizationSchema,
} from "@/schema/organization";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateOrganizationDialog() {
  const router = useRouter();
  const form = useForm<organizationFormValue>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
      keepCurrentActiveOrganization: false,
    },
  });

  const onSubmit = async (data: organizationFormValue) => {
    try {
      await createOrganization(
        data.name,
        data.slug,
        data.logo,
        data.keepCurrentActiveOrganization
      );
      toast.success("Created new organization successfully");
      router.push(`/organization/${data.slug}`);

      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 container mx-auto my-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center gap-x-2">
            <Info className="h-5 w-5" />
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John doe group" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Slug */}
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="organization-slug" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Logo */}
            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Switch */}
            <FormField
              control={form.control}
              name="keepCurrentActiveOrganization"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm">
                    Keep current active organization
                  </FormLabel>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Create Organization</Button>
      </form>
    </Form>
  );
}
