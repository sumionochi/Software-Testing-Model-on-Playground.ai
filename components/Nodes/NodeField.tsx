"use client";

import { Input } from "@/components/ui/input";
import { TaskParam, TaskParamType } from "@/schema/playgroundTask";
import StringField from "./params/StringField";
import { useReactFlow } from "@xyflow/react";
import { PlaygroundNode } from "@/schema/playgroundNode";
import { useCallback } from "react";

function NodeField({ param, nodeId }: { param: TaskParam, nodeId: string }) {
    const { updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as PlaygroundNode;
    const value = node?.data.inputs?.[param.name];
    // console.log("@VALUE", value);
    const updateNodeParamValue = useCallback(
        (newValue: string) => {
          updateNodeData(nodeId, {
            inputs: {
              ...node?.data.inputs,
              [param.name]: newValue,
            },
          });
        },
        [nodeId, updateNodeData, param.name, node?.data.inputs]
      );
      
      switch (param.type) {
        case TaskParamType.STRING:
          return (
            <StringField
              param={param}
              value={value}
              updateNodeParamValue={updateNodeParamValue}
            />
          );
        default:
          return (
            <div className="w-full">
              <p className="text-xs text-muted-foreground">
                Not implemented
              </p>
            </div>
          );
      }
}

export default NodeField;
