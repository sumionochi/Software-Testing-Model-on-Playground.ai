// Summarization.tsx

import { PlaygroundTaskType, TaskParamType, TaskDefinition } from "@/schema/playgroundTask";
import { CodeIcon, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

export const SummarizationTask: TaskDefinition = {
    type: PlaygroundTaskType.SUMMARIZATION,
    label: "Summarization",
    icon: (props: LucideProps) => (
        <CodeIcon className="stroke-green-400" {...props} />
    ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Long Text",
            type: TaskParamType.STRING,
            required: true,
            variant: "textarea",
        },
    ],
    outputs: [
        {
            name: "Summary",
            type: TaskParamType.STRING,
        },
    ],
    execute: async (inputs: Record<string, any>) => {
        const longText: string = inputs["Long Text"];
        const canSummarize = await AIService.canSummarize();

        console.log("Summarization Capability:", canSummarize);

        if (!canSummarize) {
            throw new Error("Summarization API is not ready. Please enable it in Chrome Dev.");
        }

        const summarizer = await AIService.createSummarizer();
        if (!summarizer) {
            throw new Error("Failed to create summarizer instance.");
        }

        const summary = await summarizer.summarize(longText);
        return { "Summary": summary };
    },
};
