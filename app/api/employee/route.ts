import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const employee = await prisma.employeeProfile.findMany({
      include: {
        user: true,
        organization: true,
      },
    });
    return NextResponse.json(employee, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch employees:", error);
    return NextResponse.json(
      { message: "Cannot fetch data employees." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const {
      userId,
      organizationId,
      employeeCode,
      position,
      dateOfBirth,
      phoneNumber,
      salaryType,
      baseSalary,
      hourlyRate,
    } = data;

    if (!userId || !organizationId || !employeeCode) {
      return NextResponse.json(
        { message: "userId, organizationId, and employeeCode are required." },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({ where: { id: userId } });

    if (!userExists) {
      return NextResponse.json(
        { message: `User with ID ${userId} not found.` },
        { status: 404 }
      );
    }

    const orgExists = await prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!orgExists) {
      return NextResponse.json(
        { message: `Organization with ID ${organizationId} not found.` },
        { status: 404 }
      );
    }

    const existingProfile = await prisma.employeeProfile.findFirst({
      where: {
        userId: userId,
        organizationId: organizationId,
      },
    });

    if (existingProfile) {
      return NextResponse.json(
        { message: "This user is already an employee in this organization." },
        { status: 409 }
      );
    }

    const newEmployee = await prisma.employeeProfile.create({
      data: {
        userId,
        organizationId,
        employeeCode,
        position,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        phoneNumber,
        salaryType,
        baseSalary:
          baseSalary !== null && baseSalary !== undefined && baseSalary !== ""
            ? parseFloat(String(baseSalary))
            : undefined,
        hourlyRate:
          hourlyRate !== null && hourlyRate !== undefined && hourlyRate !== ""
            ? parseFloat(String(hourlyRate))
            : undefined,
      },
    });

    return NextResponse.json(newEmployee, { status: 201 });
  } catch (error) {
    console.error("Failed to create employee profile:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            message: "Employee code already exists in this organization.",
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
