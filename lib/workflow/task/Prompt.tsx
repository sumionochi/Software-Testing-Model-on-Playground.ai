// PromptTask.tsx

import { PlaygroundTaskType, TaskParamType, TaskDefinition } from "@/schema/playgroundTask";
import { BookA, CodeIcon, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

export const PromptTask: TaskDefinition = {
  type: PlaygroundTaskType.PROMPT,
  label: "Prompt",
  icon: (props: LucideProps) => (
    <BookA className="stroke-violet-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Prompt Text",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
  ],
  outputs: [
    {
      name: "Response",
      type: TaskParamType.STRING,
    },
  ],
  execute: async (inputs: Record<string, any>) => {
    const promptText: string = inputs["Prompt Text"];
    console.log("PromptTask: Received input:", { promptText });

    const canUsePromptAPI = await AIService.canUsePromptAPI();
    if (!canUsePromptAPI) {
      throw new Error("Prompt API is not ready. Please ensure it is enabled in Chrome Dev.");
    }

    const session = await AIService.createSession();
    if (!session) {
      throw new Error("Failed to create a Prompt API session.");
    }

    try {
      const response = await AIService.prompt(session, promptText);
      console.log("PromptTask: Received response:", response);
      return { Response: response };
    } catch (error) {
      console.error("PromptTask: Error during execution:", error);
      throw new Error(`Prompt execution failed: ${error}`);
    } finally {
      AIService.destroySession(session);
    }
  },
};
