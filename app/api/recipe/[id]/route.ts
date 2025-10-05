import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: RouteContext<"/api/recipe/[id]">
) {
  const recipeId = (await params).id;
  try {
    const recipe = await prisma.recipe.findUnique({
      where: {
        id: recipeId,
      },
    });
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.log("Failed to fetch detail recipe", error);

    return NextResponse.json(
      { message: "Failed to fetch detail recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext<"/api/recipe/[id]">
) {
  const recipeId = (await params).id;
  try {
    await prisma.recipe.delete({
      where: {
        id: recipeId,
      },
    });

    return NextResponse.json(
      { message: "Recipe deleted sucessfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Recipe with ID:${recipeId} not found` },
          { status: 404 }
        );
      }
      if (error.code === "P2003") {
        return NextResponse.json(
          { message: `Cannot delete recipe by constraints` },
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
  { params }: RouteContext<"/api/recipe/[id]">
) {
  const recipeId = (await params).id;
  const {
    name,
    slug,
    description,
    estimatedCost,
    preparationTime,
    servingSize,
  } = await req.json();
  try {
    const newRecipe = await prisma.recipe.update({
      where: {
        id: recipeId,
      },
      data: {
        name,
        slug,
        description,
        estimatedCost,
        preparationTime,
        servingSize,
      },
    });
    return NextResponse.json(newRecipe, { status: 200 });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: `Cannot find recipe with Id: ${recipeId}` },
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
