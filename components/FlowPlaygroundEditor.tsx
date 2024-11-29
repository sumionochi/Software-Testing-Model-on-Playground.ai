"use client";

import { CreateNode } from "@/lib/workflow/createNode";
import { PlaygroundTaskType } from "@/schema/playgroundTask";
import { Workflow } from "@prisma/client";
import {Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./Nodes/NodeComponent";

const nodeTypes = {
  Node: NodeComponent,
}

const snapGrid: [number, number] = [50,50];
const fitViewOptions = {padding: 1};

function FlowPlaygroundEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([
    CreateNode(PlaygroundTaskType.LAUNCH_BROWSER),
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        snapToGrid={true}
        snapGrid={snapGrid}
        fitView
        fitViewOptions={fitViewOptions}
        panOnScroll={true}  
        panOnDrag={true}    
        minZoom={0.5}  
        maxZoom={2} 
      >
        <Controls position="bottom-left" fitViewOptions={fitViewOptions}/>
        <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
      </ReactFlow>
    </main>
  );
}

export default FlowPlaygroundEditor;
