"use client";

import { CreateNode } from "@/lib/workflow/createNode";
import { PlaygroundTaskType, TaskDefinition } from "@/schema/playgroundTask";
import { Workflow } from "@prisma/client";
import {
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge,
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    getOutgoers,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "./Nodes/NodeComponent";
import { useCallback, useEffect, useState } from "react";
import { PlaygroundNode } from "@/schema/playgroundNode";
import DeleteEdge from "./Edges/DeleteEdge";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { toast } from 'sonner'; // Importing 'sonner'
import { Button } from "./ui/button";

// Default trial workflow
const trialWorkflow: Workflow = {
    id: 'trial-id',
    name: 'Trial Workflow',
    userId: 'trial-user',
    description: 'This is a trial workflow.',
    definition: JSON.stringify({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
    }),
    status: 'trial',
    createdAt: new Date(),
    updatedAt: new Date(),
};

const nodeTypes = {
    Node: NodeComponent,
};

const edgeTypes = {
    default: DeleteEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowPlaygroundEditorTrial({ workflow }: { workflow?: Workflow }) {
    // Use trialWorkflow if no workflow is provided
    const currentWorkflow = workflow || trialWorkflow;

    const [nodes, setNodes, onNodesChange] = useNodesState<PlaygroundNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        try {
            const flow = JSON.parse(currentWorkflow.definition);
            if (!flow) return;
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
            if (!flow.viewport) return;
            const { x = 0, y = 0, zoom = 1 } = flow.viewport;
            setViewport({ x, y, zoom });
        } catch (error) {
            console.error("Failed to parse workflow definition:", error);
            toast.error("Failed to load workflow. Please check the console for details.");
        }
    }, [currentWorkflow, setEdges, setNodes, setViewport]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            const taskType = event.dataTransfer.getData("application/reactflow");
            if (!taskType) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = CreateNode(taskType as PlaygroundTaskType, position);
            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes]
    );

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
          const sourceNode = nodes.find((node) => node.id === connection.source);
          const targetNode = nodes.find((node) => node.id === connection.target);
      
          if (!sourceNode || !targetNode) {
            console.error("Invalid connection: source or target node not found");
            return false;
          }
      
          const sourceTask: TaskDefinition = TaskRegistry[sourceNode.data.type];
          const targetTask: TaskDefinition = TaskRegistry[targetNode.data.type];
      
          const output = sourceTask.outputs.find(
            (o) => o.name === connection.sourceHandle
          );
      
          const input = targetTask.inputs.find(
            (i) => i.name === connection.targetHandle
          );
      
          // **Check if the target input is connectable**
          if (input?.connectable === false) {
            console.error(`Invalid connection: Input "${input.name}" is not connectable.`);
            return false;
          }
      
          // Check for type mismatch
          if (input?.type !== output?.type) {
            console.error("Invalid connection: type mismatch");
            return false;
          }
      
          // Check for cycles
          const hasCycle = (node: PlaygroundNode, visited = new Set<string>()) => {
            if (visited.has(node.id)) return false;
            visited.add(node.id);
      
            for (const outgoer of getOutgoers(node, nodes, edges)) {
              if (outgoer.id === connection.source) return true;
              if (hasCycle(outgoer, visited)) return true;
            }
      
            return false;
          };
      
          const detectedCycle = hasCycle(targetNode);
          if (detectedCycle) {
            console.error("Invalid connection: cycle detected");
            return false;
          }
      
          return true;
        },
        [nodes, edges]
    );

    // Function to perform topological sort
    const topologicalSort = (nodes: PlaygroundNode[], edges: Edge[]) => {
        const sorted: PlaygroundNode[] = [];
        const visited: Set<string> = new Set();

        const nodeMap = new Map<string, PlaygroundNode>();
        nodes.forEach((node) => nodeMap.set(node.id, node));

        const adjacencyList = new Map<string, string[]>();
        nodes.forEach((node) => adjacencyList.set(node.id, []));
        edges.forEach((edge) => {
            const source = edge.source;
            const target = edge.target;
            if (adjacencyList.has(source)) {
                adjacencyList.get(source)!.push(target);
            }
        });

        const visit = (nodeId: string, temp: Set<string>, perm: Set<string>) => {
            if (perm.has(nodeId)) return;
            if (temp.has(nodeId)) throw new Error("Cycle detected in workflow");
            temp.add(nodeId);
            const neighbors = adjacencyList.get(nodeId) || [];
            neighbors.forEach((neighbor) => visit(neighbor, temp, perm));
            temp.delete(nodeId);
            perm.add(nodeId);
            const node = nodeMap.get(nodeId);
            if (node) sorted.unshift(node); // Prepend to maintain order
        };

        nodes.forEach((node) => {
            if (!visited.has(node.id)) {
                visit(node.id, new Set(), visited);
            }
        });

        return sorted;
    };

    // Function to execute tasks based on node connections
    const executeWorkflow = useCallback(async () => {
        setIsExecuting(true);
        try {
            const sortedNodes = topologicalSort(nodes, edges);
            const nodeResults: Record<string, any> = {};

            for (const node of sortedNodes) {
                const task: TaskDefinition = TaskRegistry[node.data.type];
                if (!task.execute) continue;

                const inputs: Record<string, any> = {};
                for (const inputName in node.data.inputs) {
                    const connectedEdge = edges.find(
                        (edge) => edge.target === node.id && edge.targetHandle === inputName
                    );
                    if (connectedEdge) {
                        const sourceNode = nodes.find((n) => n.id === connectedEdge.source);
                        if (!sourceNode) {
                            throw new Error(`Source node with ID "${connectedEdge.source}" not found.`);
                        }
                        const sourceTask: TaskDefinition = TaskRegistry[sourceNode.data.type];
                        const outputKey = `${connectedEdge.source}_${connectedEdge.sourceHandle}`;
                        inputs[inputName] = nodeResults[outputKey];
                    } else {
                        inputs[inputName] = node.data.inputs[inputName];
                    }
                }

                try {
                    const outputs = await task.execute(inputs);
                    for (const outputName in outputs) {
                        nodeResults[`${node.id}_${outputName}`] = outputs[outputName];
                    }
                } catch (error: any) {
                    console.error(`Error executing task ${node.id}:`, error);
                    toast.error(`Error in task "${task.label}": ${error.message}`);
                }
            }

            console.log("Workflow execution results:", nodeResults);
            toast.success("Workflow executed successfully!");
        } catch (error: any) {
            console.error("Workflow execution failed:", error);
            toast.error("Workflow execution failed. Check console for details.");
        } finally {
            setIsExecuting(false);
        }
    }, [nodes, edges]);

    return (
        <ReactFlowProvider>
            <main className="h-full w-full">
                <Button
                    onClick={executeWorkflow}
                    className={`p-2 m-4 rounded ${isExecuting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isExecuting}
                >
                    {isExecuting ? "Executing..." : "Execute Workflow"}
                </Button>
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
                    <Controls position="bottom-left" className="" fitViewOptions={fitViewOptions} />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </main>
        </ReactFlowProvider>
    );
}

export default FlowPlaygroundEditorTrial;
