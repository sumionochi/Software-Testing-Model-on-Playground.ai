"use client";

import { CreateNode } from "@/lib/workflow/createNode";
import { PlaygroundTaskType } from "@/schema/playgroundTask";
import { Workflow } from "@prisma/client";
import {Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./Nodes/NodeComponent";
import { useCallback, useEffect } from "react";
import { PlaygroundNode } from "@/schema/playgroundNode";

const nodeTypes = {
  Node: NodeComponent,
}

const snapGrid: [number, number] = [50,50];
const fitViewOptions = {padding: 1};

function FlowPlaygroundEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<PlaygroundNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {}
  }, [workflow.definition, setEdges, setNodes, setViewport]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if(typeof taskType === undefined || !taskType) return;

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    
    const newNode = CreateNode(taskType as PlaygroundTaskType, position);
    setNodes((nds) => nds.concat(newNode));
    
  }, []);  
  
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
        onDragOver={onDragOver}
        onDrop={onDrop}
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
