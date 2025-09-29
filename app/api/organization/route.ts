import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const organization = await prisma.organization.findMany();
    return NextResponse.json(organization, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return NextResponse.json(
      { message: "Cannot fetch data organization." },
      { status: 500 }
    );
  }
}
