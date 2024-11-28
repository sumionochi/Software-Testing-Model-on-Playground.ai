import { z } from "zod";

export const createWorkFlowForm = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().min(1, "Description is required").max(80),
});

export type CreateWorkFlowFormType = z.infer<typeof createWorkFlowForm>;