import { auth } from "@/lib/auth";
import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const activeTables = await prisma.restaurantTable.findMany({
      where: {
        isActive: true,
        status: "AVAILABLE",
        organizationId: session?.session.activeOrganizationId as string,
      },
    });

    return NextResponse.json(activeTables, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    return NextResponse.json(
      { message: "Cannot fetch data tables." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const { tableNumber, capacity, status, qrCodeUrl, isActive } =
      await request.json();

    if (!tableNumber || !capacity) {
      return NextResponse.json(
        { message: "Table number or capacity is required." },
        { status: 400 }
      );
    }

    const newTable = await prisma.restaurantTable.create({
      data: {
        tableNumber: String(tableNumber),
        capacity: Number(capacity),
        status: status,
        qrCodeUrl: qrCodeUrl,
        isActive: isActive,
        organizationId: session?.session.activeOrganizationId as string,
      },
    });

    return NextResponse.json(newTable, { status: 201 });
  } catch (error) {
    console.error("Failed to create a new table:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "This table is already exist." },
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
