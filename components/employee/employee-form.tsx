"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { CalendarIcon, UserIcon, BuildingIcon, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SalaryType } from "../../types/employee";
import { employeeFormSchema, EmployeeFormValues } from "../../schema/employee";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface EmployeeSheetProps {
  mode: "create" | "edit" | "view";
  employeeId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface SelectOption {
  id: string;
  name: string;
}
export function EmployeeSheet({
  mode,
  employeeId,
  open,
  onOpenChange,
  onSuccess,
}: EmployeeSheetProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [users, setUsers] = useState<SelectOption[]>([]);
  const [organizations, setOrganizations] = useState<SelectOption[]>([]);
  const { data: activeOrganization } = authClient.useActiveOrganization();
  console.log(activeOrganization);

  const title =
    mode === "view"
      ? "Employee Details"
      : mode === "edit"
        ? "Edit Employee"
        : "Create New Employee";

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      userId: "",
      organizationId: "",
      employeeCode: "",
      position: "",
      dateOfBirth: undefined,
      phoneNumber: "",
      salaryType: SalaryType.MONTHLY,
      baseSalary: 0,
      hourlyRate: 0,
    },
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, orgsRes] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/organization"),
        ]);
        const usersData = await usersRes.json();
        const orgsData = await orgsRes.json();
        setUsers(usersData);
        setOrganizations(orgsData);
      } catch (error) {
        console.error("Failed to fetch data for select fields", error);
        toast.error("Could not load users or organizations.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if ((mode === "edit" || mode === "view") && employeeId) {
        setIsLoadingData(true);
        try {
          const res = await fetch(`/api/employee/${employeeId}`);
          if (!res.ok) throw new Error("Failed to fetch employee details");
          const data = await res.json();
          form.reset({
            ...data,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          });
        } catch (error) {
          console.error(error);
          toast.error("Failed to load employee details.");
          onOpenChange(false);
        } finally {
          setIsLoadingData(false);
        }
      } else {
        form.reset();
      }
    };

    if (open) {
      fetchEmployeeData();
    }
  }, [employeeId, mode, open, form, onOpenChange]);

  const onSubmit = async (values: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      const url =
        mode === "edit" ? `/api/employee/${employeeId}` : `/api/employee`;
      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || "Something went wrong, please try again."
        );
      }

      toast.success(
        mode === "edit"
          ? "Updated employee successfully"
          : "Created new employee successfully"
      );
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Failed to ${mode} employee: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-3xl space-y-4 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{title}</SheetTitle>
        </SheetHeader>
        {isLoadingData ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 px-4"
            >
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" /> User{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={mode !== "create"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a user" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {users?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
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
                  name="organizationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <BuildingIcon className="h-4 w-4" /> Organization{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={activeOrganization?.id}
                        disabled={mode === "create" || mode === "view"}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select an organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizations?.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="employeeCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Employee Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="EMP001"
                          {...field}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Staff"
                          {...field}
                          value={field.value ?? ""}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" /> D.O.B
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          disabled={mode === "view"}
                          value={
                            field.value instanceof Date
                              ? field.value.toISOString().split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? new Date(e.target.value)
                                : undefined
                            )
                          }
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <PhoneIcon className="h-4 w-4" /> Phone number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+84 0123456789"
                          {...field}
                          value={field.value ?? ""}
                          disabled={mode === "view"}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control}
                  name="salaryType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value ?? ""}
                          disabled={mode === "view"}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Choose salary type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={SalaryType.MONTHLY}>
                              MONTHLY
                            </SelectItem>
                            <SelectItem value={SalaryType.HOURLY}>
                              HOURLY
                            </SelectItem>
                            <SelectItem value={SalaryType.MIXED}>
                              MIXED
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  {form.watch("salaryType") !== SalaryType.HOURLY && (
                    <FormField
                      control={form.control}
                      name="baseSalary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base Salary</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="VD: 15000000"
                              {...field}
                              value={field.value ?? ""}
                              disabled={mode === "view"}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                  {form.watch("salaryType") !== SalaryType.MONTHLY && (
                    <FormField
                      control={form.control}
                      name="hourlyRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hour Rate</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="VD: 50000"
                              {...field}
                              value={field.value ?? ""}
                              disabled={mode === "view"}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {mode !== "view" && (
                <SheetFooter className="flex flex-row gap-4 px-0">
                  <SheetClose asChild>
                    <Button type="button" variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </SheetClose>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : mode === "edit" ? (
                      "Save Changes"
                    ) : (
                      "Create Employee"
                    )}
                  </Button>
                </SheetFooter>
              )}
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
