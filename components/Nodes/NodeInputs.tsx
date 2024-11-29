import { cn } from "@/lib/utils";
import { TaskParam } from "@/schema/playgroundTask";
import { Handle, Position } from "@xyflow/react";
import { ReactNode } from "react";
import NodeField from "./NodeField";

export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">{children}</div>;
}

export function NodeInput({ input, nodeId }: { input: TaskParam, nodeId: string }) {
  return (
    <div className="flex justify-start relative p-3 bg-secondary w-full">
      {/* <pre>{JSON.stringify(input, null, 4)}</pre> */}
      <NodeField param={input} nodeId={nodeId}/>
      {!input.hideHandle && (
        <Handle
        id={input.name}
        type="target"
        position={Position.Left}
        className={cn(
          "bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4"
        )}
      />
      )}
    </div>
  );
}
