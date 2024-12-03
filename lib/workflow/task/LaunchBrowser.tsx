import { PlaygroundTaskType, TaskParamType } from "@/schema/playgroundTask";
import { Chrome, GlobeIcon, LucideProps } from "lucide-react";

export const LaunchBrowserTask = {
  type: PlaygroundTaskType.LAUNCH_BROWSER,
  label: "Launch Chrome",
  icon: (props: LucideProps) => (
    <Chrome className="stroke-pink-400" {...props} />
  ),
  isEntryPoint: true,
  inputs: [
    {
      name: "Website Url",
      type: TaskParamType.STRING,
      helperText: "eg: https://www.google.com",
      required: true,
      hideHandle: true,
    },
  ],
  outputs: [{name: "Web page", type: TaskParamType.BROWSER_INSTANCE}],
};
