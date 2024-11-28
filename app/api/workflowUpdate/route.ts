import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createWorkFlowForm } from "@/schema/workflowForm"; // Assuming this is your validation schema
import { z } from "zod";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedBody = createWorkFlowForm.parse({
      name: body.name,
      description: body.description,
    });

    const { id, userId, definition, status } = body;

    if (!id || !userId || !definition) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        userId,
        name: parsedBody.name,
        description: parsedBody.description,
        definition,
        status: status,
      },
    });

    return NextResponse.json(updatedWorkflow, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((e) => e.message) },
        { status: 400 }
      );
    }

    console.error("Error updating workflow:", error);
    return NextResponse.json(
      { error: "Failed to update workflow" },
      { status: 500 }
    );
  }
}
