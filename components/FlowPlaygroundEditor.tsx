// FlowPlaygroundEditor.tsx

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
import { toast } from "sonner"; // Importing 'sonner'
import { Button } from "./ui/button";
import { GitCompareArrows, Loader, CheckCircle, FileOutput } from "lucide-react";
import SignInWithGoogleButton from "@/app/(auth)/login/components/SignInWithGoogleButton";
import { createClient } from "@/utils/supabase/client";

// Import Dialog components from shadcn/ui
import TaskMenu from "./TaskMenu"; // Import TaskMenu component
import WorkflowResultsDialog, { WorkflowExecution } from "./WorkflowResultDialog";
import SaveBtn from "./WorkflowTopBar/SavePlaygroundProgress";

const nodeTypes = {
  Node: NodeComponent,
};

const edgeTypes = {
  default: DeleteEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

// Define the TaskResult interface
interface TaskResult {
  id: string;
  label: string;
  status: "pending" | "completed" | "error";
  output: null | Record<string, any>; // Allow output to be null or an object
}

// Define the WorkflowDefinition interface
interface WorkflowDefinition {
  nodes: PlaygroundNode[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  executions?: WorkflowExecution[];
}

function FlowPlaygroundEditor({ workflow }: { workflow: Workflow }) {
  // Initialize state with explicit types
  const [nodes, setNodes, onNodesChange] = useNodesState<PlaygroundNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData, toObject } = useReactFlow();
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const supabase = createClient();
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  // State for workflowDefinition with explicit type
  const [workflowDefinition, setWorkflowDefinition] = useState<WorkflowDefinition>(() => {
    try {
      const parsed = JSON.parse(workflow.definition);
      return parsed as WorkflowDefinition;
    } catch (error) {
      console.error("Failed to parse workflow definition:", error);
      toast.error("Failed to load workflow. Please check the console for details.");
      return {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        executions: [],
      };
    }
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, [supabase]);

  useEffect(() => {
    const flow = workflowDefinition;
    if (!flow) return;
    setNodes(flow.nodes || []);
    setEdges(flow.edges || []);
    if (!flow.viewport) return;
    const { x = 0, y = 0, zoom = 1 } = flow.viewport;
    setViewport({ x, y, zoom });
  }, [ setEdges, setNodes, setViewport]);

  // Initialize executions from workflowDefinition
  useEffect(() => {
    if (workflowDefinition.executions) {
      setExecutions(workflowDefinition.executions);
    }
  }, [workflowDefinition.executions]);

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

      // Check if the target input is connectable
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
    const newExecution: WorkflowExecution = {
      id: Date.now().toString(),
      timestamp: new Date(),
      status: "running",
      results: [],
    };
    setExecutions((prev) => [newExecution, ...prev]);
    setIsExecuting(true);

    try {
      const sortedNodes = topologicalSort(nodes, edges);
      const nodeResults: Record<string, any> = {};

      const initialTaskResults: TaskResult[] = sortedNodes.map((node) => ({
        id: node.id,
        label: TaskRegistry[node.data.type].label,
        status: "pending",
        output: null,
      }));

      for (const node of sortedNodes) {
        const taskIndex = initialTaskResults.findIndex((t) => t.id === node.id);
        const taskResult = { ...initialTaskResults[taskIndex] };
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
            const outputKey = `${connectedEdge.source}_${connectedEdge.sourceHandle}`;
            inputs[inputName] = nodeResults[outputKey];
          } else {
            inputs[inputName] = node.data.inputs[inputName];
          }
        }

        try {
          const outputs = await task.execute(inputs);
          for (const outputName in outputs) {
            const outputKey = `${node.id}_${outputName}`;
            nodeResults[outputKey] = outputs[outputName];
          }
          taskResult.status = "completed";
          taskResult.output = outputs;
        } catch (error: any) {
          console.error(`Error executing task ${node.id}:`, error);
          toast.error(`Error in task "${task.label}": ${error.message}`);
          taskResult.status = "error";
          taskResult.output = { error: error.message };
          newExecution.status = "error";
          break;
        }

        newExecution.results[taskIndex] = taskResult;
        setExecutions((prev) =>
          prev.map((exec) =>
            exec.id === newExecution.id ? { ...exec, results: [...newExecution.results] } : exec
          )
        );
      }

      // Update execution status
      if (newExecution.status !== "error") {
        newExecution.status = "completed";
      }

      // Update executions in workflowDefinition
      setWorkflowDefinition((prevDefinition) => {
        const updatedExecutions = [newExecution, ...(prevDefinition.executions || [])];
        return {
          ...prevDefinition,
          executions: updatedExecutions,
        };
      });

      // Update executions state
      setExecutions((prev) => [newExecution, ...prev]);

      console.log("Workflow execution results:", nodeResults);
      toast.success("Workflow executed successfully!");
    } catch (error: any) {
      console.error("Workflow execution failed:", error);
      newExecution.status = "error";

      // Update executions in workflowDefinition
      setWorkflowDefinition((prevDefinition) => {
        const updatedExecutions = [newExecution, ...(prevDefinition.executions || [])];
        return {
          ...prevDefinition,
          executions: updatedExecutions,
        };
      });

      // Update executions state
      setExecutions((prev) => [newExecution, ...prev]);

      toast.error("Workflow execution failed. Check console for details.");
    } finally {
      setIsExecuting(false);
    }
  }, [nodes, edges, setExecutions, setWorkflowDefinition, toast, topologicalSort]);

  return (
    <main className="h-full w-full flex">
      {/* Flow Editor */}
      <div className="flex-1 h-full w-full">
        <div className="flex flex-row items-center">
          <Button
            onClick={executeWorkflow}
            className={`p-2 m-4 rounded ${
              isExecuting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isExecuting}
          >
            <GitCompareArrows />
            {isExecuting ? (
              <>
                Executing <Loader className="animate-spin" />
              </>
            ) : (
              "Execute Workflow"
            )}
          </Button>

          {/* Added Workflow Output Button */}
          <Button className="mr-4" onClick={() => setIsDialogOpen(true)}>
            <FileOutput /> Workflow Output
          </Button>

          {isLoggedIn && (
            <SaveBtn
            workflowId={workflow.id}
            workflowDefinition={workflowDefinition}
            toObject={toObject}
          />
          )}

          {!isLoggedIn && (
            <div>
              <SignInWithGoogleButton />
            </div>
          )}
        </div>
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
          <Controls
            position="top-left"
            className=""
            fitViewOptions={fitViewOptions}
          />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Dialog Component */}
      <WorkflowResultsDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        executions={executions}
      />
    </main>
  );
}

export default FlowPlaygroundEditor;
