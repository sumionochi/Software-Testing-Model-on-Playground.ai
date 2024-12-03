"use client";

import { CreateNode } from "@/lib/workflow/createNode";
import { PlaygroundTaskType } from "@/schema/playgroundTask";
import { Workflow } from "@prisma/client";
import {Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, addEdge, getOutgoers, useEdgesState, useNodesState, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./Nodes/NodeComponent";
import { useCallback, useEffect } from "react";
import { PlaygroundNode } from "@/schema/playgroundNode";
import DeleteEdge from "./Edges/DeleteEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";

const nodeTypes = {
  Node: NodeComponent,
}

const edgeTypes = {
  default: DeleteEdge
}

const snapGrid: [number, number] = [50,50];
const fitViewOptions = {padding: 1};

function FlowPlaygroundEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<PlaygroundNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

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
    
  }, [screenToFlowPosition, setNodes]);  

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
  
      if (!connection.targetHandle) return;
  
      const node = nodes.find((nd) => nd.id === connection.target);
      if (!node) return;
  
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, updateNodeData, nodes]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
  
      if (!source || !target) {
        console.error("Invalid connection: source or target node not found");
        return false;
      }
  
      const sourceTask = TaskRegistry[source.data.type];
      const targetTask = TaskRegistry[target.data.type];
  
      const output = sourceTask.outputs.find(
        (o) => o.name === connection.sourceHandle
      );
  
      const input = targetTask.inputs.find(
        (o) => o.name === connection.targetHandle
      );
  
      if (input?.type !== output?.type) {
        console.error("Invalid connection: type mismatch");
        return false;
      }

      const hasCycle = (node: PlaygroundNode, visited = new Set()) => {
        if (visited.has(node.id)) return false;
        visited.add(node.id);
      
        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      
        return false;
      };
      
      const detectedCycle = hasCycle(target);
      return !detectedCycle;      
    },
    
    [nodes]
  );

  

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
        onConnect={onConnect}
        isValidConnection={isValidConnection}
      >
        <Controls position="bottom-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>

    </main>
  );
}

export default FlowPlaygroundEditor;
