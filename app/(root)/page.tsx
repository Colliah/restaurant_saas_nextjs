"use client";

import { EmployeeSheet } from "@/components/employee/employee-form";
import { EmployeeDeleteDialog } from "../../components/employee/employee-delete-dialog";
import { Button } from "@/components/ui/button";
import { Pencil, UserRoundSearch, Trash2, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Employee {
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

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [sheetState, setSheetState] = useState<{
    open: boolean;
    mode: "create" | "edit" | "view";
    employeeId?: string;
  }>({
    open: false,
    mode: "create",
  });

  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  async function fetchEmployees() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/employee", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/employee/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }
      toast.success("Employee deleted successfully");
      fetchEmployees();
    } catch (err) {
      toast.error("Employee deleted failed");
    }
  };

  const handleWatchDetails = (employee: Employee) =>
    setSheetState({ open: true, mode: "view", employeeId: employee.id });
  const handleEdit = (employee: Employee) =>
    setSheetState({ open: true, mode: "edit", employeeId: employee.id });
  const handleAddNew = () => setSheetState({ open: true, mode: "create" });

  const handleSheetSuccess = () => {
    fetchEmployees();
    setSheetState({ open: false, mode: "create" });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <Button onClick={handleAddNew}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Employee
        </Button>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <ul className="divide-y">
          {isLoading ? (
            <li className="p-4 text-center">Loading...</li>
          ) : employees.length > 0 ? (
            employees.map((emp) => (
              <li
                key={emp.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {emp.user?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {emp.employeeCode} - {emp.position || "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleWatchDetails(emp)}
                    title="View Details"
                  >
                    <UserRoundSearch className="h-5 w-5 text-blue-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(emp)}
                    title="Edit Employee"
                  >
                    <Pencil className="h-5 w-5 text-yellow-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEmployeeToDelete(emp)}
                    title="Delete Employee"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              No employees found.
            </li>
          )}
        </ul>
      </div>

      <EmployeeSheet
        open={sheetState.open}
        onOpenChange={(open) => setSheetState({ ...sheetState, open })}
        mode={sheetState.mode}
        employeeId={sheetState.employeeId}
        onSuccess={handleSheetSuccess}
      />

      {employeeToDelete && (
        <EmployeeDeleteDialog
          employee={employeeToDelete}
          open={!!employeeToDelete}
          onOpenChange={(isOpen) => !isOpen && setEmployeeToDelete(null)}
          onDeleteConfirm={handleDelete}
        />
      )}
    </div>
  );
}
