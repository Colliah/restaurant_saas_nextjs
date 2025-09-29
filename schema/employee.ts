import { SalaryType } from "@/types/employee";
import z from "zod";

export const employeeFormSchema = z.object({
  userId: z.string().min(1, "Bắt buộc"),
  organizationId: z.string().min(1, "Bắt buộc"),
  employeeCode: z.string().min(1, "Bắt buộc"),
  position: z.string().optional(),
  dateOfBirth: z.date().optional(),
  phoneNumber: z.string().optional(),
  salaryType: z.nativeEnum(SalaryType),
  baseSalary: z.coerce.number<number>(),
  hourlyRate: z.coerce.number<number>(),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
