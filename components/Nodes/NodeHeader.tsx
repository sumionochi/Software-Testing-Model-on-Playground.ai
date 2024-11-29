"use client";

import { Badge } from "@/components/ui/badge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { PlaygroundTaskType } from "@/schema/playgroundTask";
import { CoinsIcon, GripVerticalIcon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

function NodeHeader({ taskType }: { taskType: PlaygroundTaskType }) {
    const task = TaskRegistry[taskType];
    return (
      <div className="flex items-center gap-2 p-2">
        <task.icon size={16} />
        <div className="flex justify-between items-center w-full">
          <p className="text-sm font-bold uppercase text-muted-foreground">
            {task.label}
          </p>
          <div className="flex gap-1 items-center">
            {task.isEntryPoint && <Badge className="">Entry point</Badge>}
            <Badge className="gap-2 flex items-center text-xs ">
              <CoinsIcon size={16} />
              TODO
            </Badge>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="drag-handle cursor-grab"
            >
              <GripVerticalIcon size={20} />
            </Button>
          </div>
        </div>
      </div>
    );
  }
  

export default NodeHeader;
