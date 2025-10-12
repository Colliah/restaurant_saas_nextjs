import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ingredientTransactionSchema } from "@/schema/ingredient-transaction";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const ingredient = await prisma.ingredientTransaction.findMany({
      include: {
        ingredient: true,
        createdBy: true,
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
        {
          message: "Invalid request data.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { type, notes, items } = validation.data;

    const newTransactions = await prisma.$transaction(async (tx) => {
      const results = [];

      if (type === "EXPORT") {
        for (const item of items) {
          const ingredient = await tx.ingredient.findUnique({
            where: { id: item.ingredientId },
          });
          if (!ingredient || ingredient.currentStock < item.quantity) {
            throw new Error(
              `Insufficient stock for ${ingredient?.name || item.ingredientId}. Available: ${ingredient?.currentStock || 0}`
            );
          }
        }
      }

      for (const item of items) {
        await tx.ingredient.update({
          where: { id: item.ingredientId },
          data: {
            currentStock: {
              [type === "IMPORT" ? "increment" : "decrement"]: item.quantity,
            },
          },
        });

        const newTransaction = await tx.ingredientTransaction.create({
          data: {
            ingredientId: item.ingredientId,
            type,
            quantity: item.quantity,
            price: item.price,
            notes,
            createdById,
            organizationId,
          },
        });
        results.push(newTransaction);
      }
      return results;
    });

    return NextResponse.json(newTransactions, { status: 201 });
  } catch (error) {
    console.error("Failed to create transaction:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
