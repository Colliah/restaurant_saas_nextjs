"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { TableStatus } from "@/types/table";
import { tableSchema, TablesFormValues } from "@/schema/tables";

interface TableFormProps {
  table?: TablesFormValues & { id: string };
}

export function TableForm({ table }: TableFormProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const isUpdate = !!table?.id;
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const form = useForm<TablesFormValues>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      tableNumber: table?.tableNumber ?? "",
      capacity: table?.capacity ?? 2,
      status: table?.status ?? TableStatus.AVAILABLE,
      qrCodeUrl: table?.qrCodeUrl ?? "",
      isActive: table?.isActive ?? true,
    },
    mode: "onTouched",
  });

  async function onSubmit(values: TablesFormValues) {
    let url = `${baseUrl}/api/tables`;
    let method = "POST";

    if (isUpdate) {
      url = `${baseUrl}/api/tables/${table.id}`;
      method = "PATCH";
    }

    try {
      setSubmitting(true);
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || (isUpdate ? "Cập nhật thất bại" : "Tạo mới thất bại")
        );
      }

      toast.success(
        isUpdate
          ? `Cập nhật Bàn ${values.tableNumber} thành công`
          : `Tạo mới Bàn ${values.tableNumber} thành công`
      );

      form.reset(values);
    } catch (error) {
      console.error(error);
      toast.error((error as Error).message || "Đã xảy ra lỗi hệ thống.");
    } finally {
      setSubmitting(false);
    }
  }

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number(value);

    if (!isNaN(numValue) && numValue > 0) {
      form.setValue("capacity", numValue, { shouldValidate: true });
    } else {
      form.setValue("capacity", 0, { shouldValidate: true });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
        <FormField
          control={form.control}
          name="tableNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. A12 or 7"
                  {...field}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 4"
                  value={field.value > 0 ? field.value : ""}
                  onChange={handleCapacityChange}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(TableStatus).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qrCodeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>QR Code URL (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/tables/A12"
                  {...field}
                  value={field.value || ""}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Toggle to enable/disable this table.
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={submitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
            disabled={submitting}
          >
            {isUpdate ? "Cancel" : "Reset"}
          </Button>

          <Button type="submit" disabled={submitting}>
            {submitting
              ? "Saving..."
              : isUpdate
                ? "Save Changes"
                : "Create Table"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
