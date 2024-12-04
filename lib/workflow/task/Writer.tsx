import { PlaygroundTaskType, TaskParamType, TaskDefinition } from "@/schema/playgroundTask";
import { PencilIcon, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

// Helper function to sanitize and combine input and context
function prepareInput(input: string, context?: string): string {
  const sanitizedInput = input.replace(/[^a-zA-Z0-9\s.,!?'"()-]/g, '');
  const sanitizedContext = context
    ? context.replace(/[^a-zA-Z0-9\s.,!?'"()-]/g, '')
    : '';
  const combinedInput = sanitizedContext
    ? `${sanitizedInput} ${sanitizedContext}`
    : sanitizedInput;
  console.log("Prepared Input:", combinedInput);
  return combinedInput.trim();
}

export const WriterTask: TaskDefinition = {
  type: PlaygroundTaskType.WRITER,
  label: "Writer",
  icon: (props: LucideProps) => (
    <PencilIcon className="stroke-amber-600" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Input",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Context",
      type: TaskParamType.STRING,
      required: false,
      variant: "textarea",
      connectable: false
    },
  ],
  outputs: [
    {
      name: "Generated Text",
      type: TaskParamType.STRING,
    },
  ],
  execute: async (inputs: Record<string, any>) => {
    let inputText: string = inputs["Input"];
    let context: string | undefined = inputs["Context"];

    // Prepare input by combining inputText and context
    const combinedInput = prepareInput(inputText, context);

    const writer = await AIService.createWriter();
    if (!writer) {
      throw new Error("Failed to create writer instance.");
    }

    try {
      console.log(combinedInput, "hehe");
      const generatedText = await AIService.writeText(writer, combinedInput);
      console.log("WriterTask: Generated text:", generatedText);
      return { "Generated Text": generatedText };
    } catch (error: any) {
      console.error("WriterTask: Error during writing:", error.message);
      throw new Error("Writing failed: " + error.message);
    } finally {
      writer.destroy();
    }
  },
};
