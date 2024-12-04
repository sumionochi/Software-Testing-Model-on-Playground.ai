// Translation.tsx

import { PlaygroundTaskType, TaskParamType, TaskDefinition } from "@/schema/playgroundTask";
import { GlobeIcon, Languages, LucideProps } from "lucide-react";
import { AIService } from "@/lib/aiService";

export const TranslationTask: TaskDefinition = {
  type: PlaygroundTaskType.TRANSLATION,
  label: "Translation",
  icon: (props: LucideProps) => (
    <Languages className="stroke-rose-400" {...props} />
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
      options: [
        "af", "am", "ar", "ar-Latn", "az", "be", "bg", "bg-Latn", "bn", "bs", "ca", "ceb", "co", "cs", "cy",
        "da", "de", "el", "el-Latn", "en", "eo", "es", "et", "eu", "fa", "fi", "fil", "fr", "fy", "ga", "gd",
        "gl", "gu", "ha", "haw", "hi", "hi-Latn", "hmn", "hr", "ht", "hu", "hy", "id", "ig", "is", "it", "iw",
        "ja", "ja-Latn", "jv", "ka", "kk", "km", "kn", "ko", "ku", "ky", "la", "lb", "lo", "lt", "lv", "mg",
        "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "ne", "nl", "no", "ny", "pa", "pl", "ps", "pt", "ro",
        "ru", "ru-Latn", "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "st", "su", "sv", "sw", "ta",
        "te", "tg", "th", "tr", "uk", "ur", "uz", "vi", "xh", "yi", "yo", "zh", "zh-Latn", "zu"
      ],
      defaultValue: "en",
      connectable: false,
      variant: "select",

    },
    {
      name: "Target Language",
      type: TaskParamType.STRING,
      required: true,
      options: [
        "af", "am", "ar", "ar-Latn", "az", "be", "bg", "bg-Latn", "bn", "bs", "ca", "ceb", "co", "cs", "cy",
        "da", "de", "el", "el-Latn", "en", "eo", "es", "et", "eu", "fa", "fi", "fil", "fr", "fy", "ga", "gd",
        "gl", "gu", "ha", "haw", "hi", "hi-Latn", "hmn", "hr", "ht", "hu", "hy", "id", "ig", "is", "it", "iw",
        "ja", "ja-Latn", "jv", "ka", "kk", "km", "kn", "ko", "ku", "ky", "la", "lb", "lo", "lt", "lv", "mg",
        "mi", "mk", "ml", "mn", "mr", "ms", "mt", "my", "ne", "nl", "no", "ny", "pa", "pl", "ps", "pt", "ro",
        "ru", "ru-Latn", "sd", "si", "sk", "sl", "sm", "sn", "so", "sq", "sr", "st", "su", "sv", "sw", "ta",
        "te", "tg", "th", "tr", "uk", "ur", "uz", "vi", "xh", "yi", "yo", "zh", "zh-Latn", "zu"
      ],
      defaultValue: "ja",
      connectable: false,
      variant: "select",
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
