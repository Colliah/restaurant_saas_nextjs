import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const ingredient = await prisma.ingredient.findMany({
      include: {
        recipeItems: true,
        transactions: true,
      },
    });
    return NextResponse.json(ingredient, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch ingredient:", error);
    return NextResponse.json(
      { message: "Cannot fetch data ingredient." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const organizationId = session?.session.activeOrganizationId;
  try {
    if (!organizationId) {
      return NextResponse.json(
        { message: "Unauthorized: No active organization found." },
        { status: 401 }
      );
    }
    const data = await req.json();
    const { slug, name, code, unit, imageId, lowStockThreshold } = data;

    if (!slug || !name || !unit) {
      return NextResponse.json(
        { error: "Slug, name, and unit are required" },
        { status: 400 }
      );
    }

    const ingredientData = {
      slug,
      name,
      code,
      unit,
      lowStockThreshold: lowStockThreshold || 10,
      organization: {
        connect: {
          id: organizationId,
        },
      },
      ...(imageId && { image: { connect: { id: imageId } } }),
    };

    const newIngredient = await prisma.ingredient.create({
      data: ingredientData,
    });

    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error) {
    console.error("Failed to create ingredient:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { message: "An ingredient with this slug already exists." },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Organization with ID: ${organizationId} not found.` },
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
