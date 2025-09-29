"use client";

import type React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Calendar, Building, Mail, UserCheck } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { EmployeeData } from "@/types/employee";



interface EmployeeDetailsDialogProps {
  employee: EmployeeData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmployeeDetailsDialog({
  employee,
  open,
  onOpenChange,
}: EmployeeDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex w-full items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Employee Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <h3>
                    <span className="flex items-center gap-1 font-semibold text-lg">
                      <User className="h-4 w-4" />
                      {employee?.user?.name} - {employee?.employeeCode}
                    </span>
                    <span>
                      <Badge variant="outline" className="text-[12px]">
                        {employee?.user.id}
                      </Badge>
                    </span>
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee?.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{employee?.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(employee?.dateOfBirth)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                  {employee?.user?.role}
                </div>
              </div>
            </CardContent>
            <Separator />
            <CardContent>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Work Information
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Organization
                  </label>
                  <p className="text-sm">{employee?.organization.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Position
                  </label>
                  <p className="text-sm">{employee?.position}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Salary Type
                  </label>
                  <div className="text-sm">{employee?.salaryType}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
