import { z } from "zod";

export const createWorkFlowForm = z.object({
  name: z.string().max(50),
  description: z.string().max(80),
});

export type CreateWorkFlowFormType = z.infer<typeof createWorkFlowForm>;