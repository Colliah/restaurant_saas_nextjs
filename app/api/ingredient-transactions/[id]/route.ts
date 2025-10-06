import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/ingredient-transactions/[id]">
) {
  const id = (await params).id;
  try {
    const data = await prisma.ingredientTransaction.findUnique({
      where: {
        id,
      },
      include: {
        ingredient: true,
      },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch detail ingredient", error);
    return NextResponse.json(
      { message: "Cannot fetch data employee." },
      { status: 500 }
    );
  }
}
