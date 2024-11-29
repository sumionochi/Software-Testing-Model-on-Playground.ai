import { PlaygroundTaskType } from "@/schema/playgroundTask";
import { Node } from "@xyflow/react";

export interface PlaygroundNodeData {
  type: PlaygroundTaskType;
  inputs: Record<string, string>;
  [key: string]: any;
}

export interface PlaygroundNode extends Node {
  data: PlaygroundNodeData;
}
