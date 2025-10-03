import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/employee/[id]">
) {
  const employeeId = (await params).id;
  try {
    const employee = await prisma.employeeProfile.findUnique({
      where: {
        id: employeeId,
      },
      include: {
        user: true,
        organization: true,
      },
    });
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch employee", error);
    return NextResponse.json(
      { message: "Cannot fetch data employee." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const employeeId = params.id;

  try {
    await prisma.employeeProfile.delete({
      where: {
        id: employeeId,
      },
    });

    return NextResponse.json(
      { message: "Employee deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(`[EMPLOYEE_DELETE_ERROR] ID: ${employeeId}`, error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Employee with ID: ${employeeId} not found.` },
          { status: 404 }
        );
      }

      if (error.code === "P2003") {
        return NextResponse.json(
          {
            message:
              "Cannot delete employee due to related records (payrolls, shifts, etc.).",
          },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: RouteContext<"/api/employee/[id]">
) {
  const employeeId = (await params).id;
  const {
    employeeCode,
    position,
    dateOfBirth,
    phoneNumber,
    salaryType,
    baseSalary,
    hourlyRate,
  } = await req.json();

  try {
    const updateEmployee = await prisma.employeeProfile.update({
      where: {
        id: employeeId,
      },
      data: {
        employeeCode,
        position,
        dateOfBirth,
        phoneNumber,
        salaryType,
        baseSalary,
        hourlyRate,
      },
    });

    return NextResponse.json(updateEmployee, { status: 200 });
  } catch (error) {
    console.error("Failed to delete employee:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Cannot find employee with Id: ${employeeId}` },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
