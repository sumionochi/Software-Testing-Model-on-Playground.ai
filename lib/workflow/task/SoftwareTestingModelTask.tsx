// SoftwareTestingModelTask.tsx

import { PlaygroundTaskType, TaskParamType, TaskDefinition } from "@/schema/playgroundTask";
import { BookA, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

// Hardcoded prompt for generating unit tests
// Customize this as needed (framework, style, etc.)
const HARD_CODED_UNIT_TEST_PROMPT = `
You are a software testing model. I will provide you with a piece of code or a description of a function, and you will produce a corresponding unit test.
The unit test should be written in Jest testing framework, assuming the function is exported from a module named 'myModule'.

Requirements:
1. Import the necessary function(s) from 'myModule'.
2. Write a describe block that clearly indicates what function is being tested.
3. Include a series of test() calls that cover various inputs and edge cases.
4. Use Jest's expect() assertions to validate the function's behavior.
5. Include at least one test for an error case if applicable.

Input:
`;

export const SoftwareTestingModelTask: TaskDefinition = {
  type: PlaygroundTaskType.SOFTWARE_TESTING_MODEL,
  label: "Software Testing Model",
  icon: (props: LucideProps) => (
    <BookA className="stroke-violet-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Function Description",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
  ],
  outputs: [
    {
      name: "Unit Test Code",
      type: TaskParamType.STRING,
    },
  ],
  execute: async (inputs: Record<string, any>) => {
    const functionDescription: string = inputs["Function Description"];
    console.log("SoftwareTestingModelTask: Received input:", { functionDescription });

    const canUsePromptAPI = await AIService.canUsePromptAPI();
    if (!canUsePromptAPI) {
      throw new Error("Prompt API is not ready. Please ensure it is enabled in Chrome Dev.");
    }

    const session = await AIService.createSession();
    if (!session) {
      throw new Error("Failed to create a Prompt API session.");
    }

    try {
      // Combine the hardcoded prompt with the user's input
      const finalPrompt = `${HARD_CODED_UNIT_TEST_PROMPT}\n${functionDescription}\n\nGenerate the unit test now:`;
      const response = await AIService.prompt(session, finalPrompt);
      console.log("SoftwareTestingModelTask: Received response:", response);
      return { "Unit Test Code": response };
    } catch (error) {
      console.error("SoftwareTestingModelTask: Error during execution:", error);
      throw new Error(`Prompt execution failed: ${error}`);
    } finally {
      AIService.destroySession(session);
    }
  },
};
