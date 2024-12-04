// LanguageDetectionTask.tsx

import { PlaygroundTaskType, TaskParamType } from "@/schema/playgroundTask";
import { GlobeIcon, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

export const LanguageDetectionTask = {
    type: PlaygroundTaskType.LANGUAGE_DETECTION,
    label: "Language Detection",
    icon: (props: LucideProps) => (
        <GlobeIcon className="stroke-blue-400" {...props} />
    ),
    isEntryPoint: false,
    inputs: [
        {
            name: "Text",
            type: TaskParamType.STRING,
            required: true,
            variant: "textarea",
        },
    ],
    outputs: [
        {
            name: "Detected Languages",
            type: TaskParamType.STRING,
        },
    ],
    execute: async (inputs: Record<string, any>) => {
        const text: string = inputs["Text"];
        const canDetect = await AIService.canDetectLanguage();
        if (canDetect !== 'readily') {
            throw new Error("Language Detection API is not ready.");
        }

        const detector = await AIService.createLanguageDetector();
        if (!detector) {
            throw new Error("Failed to create Language Detector.");
        }

        const results = await AIService.detectLanguage(detector, text);
        return { "Detected Languages": JSON.stringify(results) };
    },
};
