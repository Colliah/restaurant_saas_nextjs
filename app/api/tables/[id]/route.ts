import { PrismaClientKnownRequestError } from "@/lib/generated/prisma/runtime/library";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: RouteContext<"/api/tables/[id]">
) {
  const tableId = (await params).id;

  try {
    const table = await prisma.restaurantTable.findUnique({
      where: {
        id: tableId,
      },
    });

    return NextResponse.json(table, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch tables:", error);
    return NextResponse.json(
      { message: "Cannot fetch data tables." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext<"/api/tables/[id]">
) {
  const tableId = (await params).id;
  try {
    const deletedTable = await prisma.restaurantTable.delete({
      where: {
        id: tableId,
      },
    });
    return NextResponse.json(deletedTable, { status: 200 });
  } catch (error) {
    console.error("Failed to delete table:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Cannot find table with Id: ${tableId}` },
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

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext<"/api/tables/[id]">
) {
  const tableId = (await params).id;

  const { tableNumber, capacity, status, qrCodeUrl, isActive } =
    await request.json();

  try {
    const updateTable = await prisma.restaurantTable.update({
      where: {
        id: tableId,
      },
      data: {
        tableNumber: String(tableNumber),
        capacity: Number(capacity),
        status: status,
        qrCodeUrl: qrCodeUrl,
        isActive: isActive,
      },
    });
    return NextResponse.json(updateTable, { status: 200 });
  } catch (error) {
    console.error("Failed to delete table:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Cannot find table with Id: ${tableId}` },
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
