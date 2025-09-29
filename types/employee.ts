export enum SalaryType {
  HOURLY = "HOURLY",
  MONTHLY = "MONTHLY",
  MIXED = "MIXED",
}

export interface EmployeeData {
  id: string;
  employeeCode: string;
  position: string;
  dateOfBirth: string;
  phoneNumber: string;
  salaryType: "MONTHLY" | "HOURLY" | "YEARLY";
  organizationId: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}
