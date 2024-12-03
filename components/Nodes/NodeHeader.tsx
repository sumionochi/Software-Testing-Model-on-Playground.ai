"use client";

import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { PlaygroundTaskType } from "@/schema/playgroundTask";
import { CoinsIcon, CopyIcon, Delete, GripVerticalIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useReactFlow } from "@xyflow/react";
import { PlaygroundNode } from "@/schema/playgroundNode";
import { CreateNode } from "@/lib/workflow/createNode";

function NodeHeader({ taskType, nodeId }: { taskType: PlaygroundTaskType , nodeId:string}) {
    const task = TaskRegistry[taskType];
    const { deleteElements, getNode, addNodes } = useReactFlow();

    return (
      <div className="flex items-center gap-2 p-2">
        <task.icon size={16} />
        <div className="flex justify-between items-center w-full">
          <p className="text-xs font-bold uppercase text-muted-foreground">
            {task.label}
          </p>
          <div className="flex gap-1 items-center">
            {task.isEntryPoint && <Badge>Entry point</Badge>}
            <Badge className="gap-2 flex items-center text-xs">
              <CoinsIcon size={16} />
              TODO
            </Badge>
            {!task.isEntryPoint && (
              <>
              
              <Button
                variant={"ghost"}
                size={"icon"}
                onClick={() => {
                  deleteElements({
                    nodes: [{ id: nodeId }],
                  });
                }}
              >
                <Delete/>
              </Button>
              <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                const node = getNode(nodeId) as PlaygroundNode;
                const newX = node.position.x;
                const newY = node.position.y + node.measured?.height! + 20;
                const newNode = CreateNode(node.data.type, {
                  x: newX,
                  y: newY,
                });
            
                addNodes([newNode]);
              }}
            >
              <CopyIcon size={12} />
            </Button> </>           
            )}
          </div>
        </div>
      </div>
    );
}
  

export default NodeHeader;
