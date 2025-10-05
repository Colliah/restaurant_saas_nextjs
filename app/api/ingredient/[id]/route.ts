import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/ingredient/[id]">
) {
  const ingredientId = (await params).id;
  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: {
        id: ingredientId,
      },
      include: {
        recipeItems: true,
        transactions: true,
      },
    });
    return NextResponse.json(ingredient, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch detail ingredient", error);
    return NextResponse.json(
      { message: "Cannot fetch data employee." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext<"/api/ingredient/[id]">
) {
  const ingredientId = (await params).id;
  try {
    await prisma.ingredient.delete({
      where: {
        id: ingredientId,
      },
    });
    return NextResponse.json(
      { message: "Ingredient deleted sucessfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Ingredient with ID:${ingredientId} not found` },
          { status: 404 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { message: `Cannot delete ingredient by constraints` },
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
  { params }: RouteContext<"/api/ingredient/[id]">
) {
  const ingredientId = (await params).id;
  const { name, code, unit } = await req.json();
  try {
    const newIngredient = await prisma.ingredient.update({
      where: {
        id: ingredientId,
      },
      data: {
        name,
        code,
        unit,
      },
    });
    return NextResponse.json(newIngredient, { status: 200 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Cannot find ingredient with Id: ${ingredientId}` },
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
