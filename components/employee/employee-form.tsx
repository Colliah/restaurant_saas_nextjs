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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, UserIcon, BuildingIcon, PhoneIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { SalaryType } from "@/types/employee";
import { employeeFormSchema, EmployeeFormValues } from "@/schema/employee";
import { toast } from "sonner";

interface EmployeeFormProps {
  initialData?: EmployeeFormValues;
  onSuccess: () => void;
}
interface SelectOption {
  id: string;
  name: string;
}

export function EmployeeForm({ initialData, onSuccess }: EmployeeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!initialData;
  const [users, setUsers] = useState<SelectOption[]>([]);
  const [organizations, setOrganizations] = useState<SelectOption[]>([]);

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialData || {
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
        const usersRes = await fetch("/api/users");
        const orgsRes = await fetch("/api/organization");

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

  const onSubmit = async (values: EmployeeFormValues) => {
    setIsSubmitting(true);
    try {
      const url = isEditMode
        ? `/api/employee/${initialData.userId}`
        : `/api/employee`;

      const method = isEditMode ? "PATCH" : "POST";

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
        isEditMode
          ? "Updated employee successfully"
          : "Created new employee successfully"
      );
      onSuccess();
    } catch (error) {
      toast.error(
        `Failed to ${isEditMode ? "update" : "create"} employee:${error}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="container mx-auto border-2">
      <CardHeader>
        <CardTitle className="flex justify-center text-2xl font-bold">
          {isEditMode ? "Edit Employee Profile" : "Create New Employee"}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        disabled={isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 border-2 focus:border-primary">
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
                        value={field.value}
                        disabled={isEditMode}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 border-2 focus:border-primary">
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                            className="h-12 border-2 focus:border-primary"
                            {...field}
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
                            className="h-12 border-2 focus:border-primary"
                            {...field}
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
                            className="h-12 border-2 focus:border-primary"
                            value={
                              field.value instanceof Date
                                ? field.value.toISOString().split("T")[0]
                                : ""
                            }
                            onChange={(e) => {
                              const dateValue = e.target.value;
                              field.onChange(
                                dateValue ? new Date(dateValue) : undefined
                              );
                            }}
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
                            className="h-12 border-2 focus:border-primary"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
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
                          >
                            <SelectTrigger className="h-12 w-full border-2 focus:border-primary">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
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
                                className="h-12 border-2 focus:border-primary"
                                {...field}
                                value={field.value ?? ""}
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
                                className="h-12 border-2 focus:border-primary"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-12 text-lg w-full"
              >
                {isSubmitting
                  ? "Processing..."
                  : isEditMode
                    ? "Update Employee"
                    : "Create Employee"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
