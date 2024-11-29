import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const workflowUpdateSchema = z.object({
  id: z.string(),
  definition: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = workflowUpdateSchema.parse(body);
    const { id, definition, name, description, status } = validatedData;

    const updatedWorkflow = await prisma.workflow.update({
      where: { id },
      data: {
        definition,
        name,
        description,
        status,
      },
    });

    return NextResponse.json(updatedWorkflow, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors.map((err) => err.message) },
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
