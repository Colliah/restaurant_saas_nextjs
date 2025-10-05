import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const recipe = await prisma.recipe.findMany();
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Cannot fetch data recipe." },
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
    const {
      name,
      description,
      slug,
      estimatedCost,
      preparationTime,
      servingSize,
    } = data;

    if (!slug || !name || !estimatedCost) {
      return NextResponse.json(
        { error: "Slug, name, and estimatedCost are required" },
        { status: 400 }
      );
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        name,
        description,
        slug,
        estimatedCost,
        preparationTime,
        servingSize,
        organizationId,
      },
    });
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
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
