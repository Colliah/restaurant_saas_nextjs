import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { prisma } from "@/lib/prisma";
import { ingredientTransactionSchema } from "@/schema/ingredient-transaction";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const ingredient = await prisma.ingredientTransaction.findMany({
      include: {
        ingredient: true,
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
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const createdById = session?.user?.id;
    const organizationId = session?.session.activeOrganizationId;

    if (!createdById || !organizationId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = ingredientTransactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { ingredientId, type, quantity, price, notes } = validation.data;

    const ingredient = await prisma.ingredient.findFirst({
      where: { id: ingredientId, organizationId },
    });

    if (!ingredient) {
      return NextResponse.json(
        { message: "Ingredient not found or you don't have permission." },
        { status: 404 }
      );
    }

    if (type === "IMPORT") {
      const [, newTransaction] = await prisma.$transaction([
        prisma.ingredient.update({
          where: { id: ingredientId },
          data: { currentStock: { increment: quantity } },
        }),
        prisma.ingredientTransaction.create({
          data: {
            ingredientId,
            type,
            quantity,
            price,
            notes,
            createdById,
            organizationId,
          },
        }),
      ]);
      return NextResponse.json(newTransaction, { status: 201 });
    } else if (type === "EXPORT") {
      if (ingredient.currentStock < quantity) {
        return NextResponse.json(
          {
            message: `Insufficient stock. Only ${ingredient.currentStock} ${ingredient.unit} available.`,
          },
          { status: 400 }
        );
      }

      const [, newTransaction] = await prisma.$transaction([
        prisma.ingredient.update({
          where: { id: ingredientId },
          data: { currentStock: { decrement: quantity } },
        }),
        prisma.ingredientTransaction.create({
          data: {
            ingredientId,
            type,
            quantity,
            price,
            notes,
            createdById,
            organizationId,
          },
        }),
      ]);
      return NextResponse.json(newTransaction, { status: 201 });
    }

    return NextResponse.json(
      { message: "Invalid transaction type specified." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to create transaction:", error);
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { message: "A required record was not found." },
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
