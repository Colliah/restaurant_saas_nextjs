"use client";

import { EmployeeDeleteDialog } from "@/components/employee/employee-delete-dialog";
import { EmployeeDetailsDialog } from "@/components/employee/employee-detail-dialog";
import { EmployeeForm } from "@/components/employee/employee-form";
import { Button } from "@/components/ui/button";
import { Pencil, UserRoundSearch, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<any | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<any | null>(null);

  async function fetchEmployees() {
    try {
      const res = await fetch("/api/employee", { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await res.json();
      setEmployees(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees.");
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/employee/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "An unknown error occurred");
      }

      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      toast.success("Employee deleted successfully");
    } catch (err: any) {
      console.error("Error deleting employee:", err);
      toast.error(err.message);
    }
  };

  const handleWatchDetails = (employee: any) => {
    setViewingEmployee(employee);
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEmployee(null);
    fetchEmployees();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Employee List</h1>
        {!showForm && <Button onClick={handleAddNew}>Add New Employee</Button>}
      </div>

      {showForm ? (
        <div className="mb-6">
          <EmployeeForm
            initialData={editingEmployee}
            onSuccess={handleFormSuccess}
          />
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <ul className="space-y-2">
          {employees.map((emp) => (
            <li
              key={emp.id}
              className="flex items-center justify-between border p-2 rounded"
            >
              <span>
                {emp.employeeCode} - {emp.position || "N/A"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleWatchDetails(emp)}
                >
                  <UserRoundSearch className="h-5 w-5 text-blue-500 hover:text-blue-700 transition-colors" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(emp)}
                >
                  <Pencil className="h-5 w-5 text-yellow-500 hover:text-yellow-700 transition-colors" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setEmployeeToDelete(emp)}
                >
                  <X className="h-5 w-5 text-red-500 hover:text-red-700 transition-colors" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <EmployeeDetailsDialog
        employee={viewingEmployee}
        open={!!viewingEmployee}
        onOpenChange={(isOpen) => {
          if (!isOpen) setViewingEmployee(null);
        }}
      />

      {employeeToDelete && (
        <EmployeeDeleteDialog
          employee={employeeToDelete}
          open={!!employeeToDelete}
          onOpenChange={(isOpen) => {
            if (!isOpen) setEmployeeToDelete(null);
          }}
          onDeleteConfirm={handleDelete}
        />
      )}
    </div>
  );
}
