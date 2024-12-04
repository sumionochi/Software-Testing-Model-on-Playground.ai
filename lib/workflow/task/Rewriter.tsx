import { PlaygroundTaskType, TaskParamType, TaskDefinition } from "@/schema/playgroundTask";
import { RepeatIcon, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

// Helper function to sanitize input
function sanitizeInput(text: string): string {
  return text.replace(/[^a-zA-Z0-9\s.,!?'"()-]/g, '');
}

// Helper function to combine inputs into a single string
function prepareInput(sharedContext: string, tone: string, length: string, format: string): string {
  return `Shared Context: ${sharedContext}, Tone: ${tone}, Length: ${length}, Format: ${format}`;
}

export const RewriterTask: TaskDefinition = {
  type: PlaygroundTaskType.REWRITER,
  label: "Rewriter",
  icon: (props: LucideProps) => (
    <RepeatIcon className="stroke-orange-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Shared Context",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Tone",
      type: TaskParamType.STRING,
      required: false,
      variant: "select",
      options: ["as-is", "more-formal", "more-casual"],
      defaultValue: "as-is",
      connectable: false
    },
    {
      name: "Length",
      type: TaskParamType.STRING,
      required: false,
      variant: "select",
      options: ["as-is", "shorter", "longer"],
      defaultValue: "as-is",
      connectable: false
    },
    {
      name: "Format",
      type: TaskParamType.STRING,
      required: false,
      variant: "select",
      options: ["as-is", "plain-text", "markdown"],
      defaultValue: "as-is",
      connectable: false
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
      name: "Rewritten Text",
      type: TaskParamType.STRING,
    },
  ],
  execute: async (inputs: Record<string, any>) => {
    let sharedContext: string = inputs["Shared Context"];
    const tone: string = inputs["Tone"] || "as-is";
    const length: string = inputs["Length"] || "as-is";
    const format: string = inputs["Format"] || "as-is";
    let context: string | undefined = inputs["Context"];

    // Sanitize inputs
    sharedContext = sanitizeInput(sharedContext);
    if (context) {
      context = sanitizeInput(context);
    }

    // Combine inputs into a single string
    const combinedInput = prepareInput(sharedContext, tone, length, format);
    console.log("RewriterTask: Prepared combined input:", combinedInput);

    const rewriterOptions: AIRewriterCreateOptions = {
      sharedContext: combinedInput,
    };

    const rewriter = await AIService.createRewriter(rewriterOptions);

    if (!rewriter) {
      throw new Error("Failed to create rewriter instance.");
    }

    try {
      const rewrittenText = await AIService.rewriteText(rewriter, combinedInput, context);
      console.log("RewriterTask: Rewritten text:", rewrittenText);
      return { "Rewritten Text": rewrittenText };
    } catch (error: any) {
      console.error("RewriterTask: Error during rewriting:", error);
      throw new Error(`Rewriting failed: ${error.message}`);
    } finally {
      rewriter.destroy();
    }
  },
};
