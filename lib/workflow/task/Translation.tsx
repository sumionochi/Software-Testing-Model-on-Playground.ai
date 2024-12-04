// Translation.tsx

import { PlaygroundTaskType, TaskParamType, TaskDefinition } from "@/schema/playgroundTask";
import { GlobeIcon, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

export const TranslationTask: TaskDefinition = {
  type: PlaygroundTaskType.TRANSLATION,
  label: "Translation",
  icon: (props: LucideProps) => (
    <GlobeIcon className="stroke-yellow-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Text",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
      name: "Source Language",
      type: TaskParamType.STRING,
      required: true,
      helperText: "e.g., en, es, fr",
    },
    {
      name: "Target Language",
      type: TaskParamType.STRING,
      required: true,
      helperText: "e.g., en, es, fr",
    },
  ],
  outputs: [
    {
      name: "Translated Text",
      type: TaskParamType.STRING,
    },
  ],
  execute: async (inputs: Record<string, any>) => {
    const text: string = inputs["Text"];
    const sourceLang: string = inputs["Source Language"];
    const targetLang: string = inputs["Target Language"];

    // Check if the translation capability is ready
    const canTranslate = await AIService.canTranslate(sourceLang, targetLang);
    if (!canTranslate) {
      throw new Error(`Translation from "${sourceLang}" to "${targetLang}" is not available or still installing.`);
    }

    const translator = await AIService.createTranslator(sourceLang, targetLang);
    if (!translator) {
      throw new Error("Failed to create translator instance.");
    }

    const translatedText = await AIService.translateText(translator, text);
    return { "Translated Text": translatedText };
  },
};
