import { PlaygroundTaskType, TaskParamType } from "@/schema/playgroundTask";
import { CodeIcon, GlobeIcon, LetterText, LucideProps } from "lucide-react";

export const ExtractTextFromElement = {
  type: PlaygroundTaskType.EXTRACT_TEXT_FROM_ELEMENT,
  label: "Extract Text",
  icon: (props: LucideProps) => (
    <LetterText className="stroke-rose-400" {...props} />
  ),
  isEntryPoint: false,
  inputs: [
    {
      name: "Html",
      type: TaskParamType.STRING,
      required: true,
      variant: "textarea",
    },
    {
        name: "Selector",
        type: TaskParamType.STRING,
        required: true,
      }
  ],
  outputs: [
    {
      name: "Extracted Text",
      type: TaskParamType.STRING,
    },
  ],
};
