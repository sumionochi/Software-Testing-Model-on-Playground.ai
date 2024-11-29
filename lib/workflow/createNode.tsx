import { PlaygroundNode } from "@/schema/playgroundNode";
import { PlaygroundTaskType } from "@/schema/playgroundTask";

export function CreateNode(
  nodeType: PlaygroundTaskType,
  position?: { x: number; y: number }
): PlaygroundNode {
  return {
    id: crypto.randomUUID(),
    type: "Node",
    dragHandle:".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
}
