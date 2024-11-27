import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Update this path based on your project structure

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); 
    const { userId, name, description, definition, status } = body;

    if (!userId || !definition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        name, 
        description,
        definition,
        status,
      },
    });

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    );
  }
}
