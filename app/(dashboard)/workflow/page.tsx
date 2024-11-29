"use client";

import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Layers,
  Plus,
  Terminal,
  Trash2,
  Edit,
  MoreVertical,
  Pen,
  Workflow,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CreateWorkflowButton from "@/components/CreateWorkflowButton";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import EditWorkflowForm from "@/components/EditWorkflowForm";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, Info } from 'lucide-react'
import { useRouter } from 'next/navigation';

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
}

type BadgeVariant = "success" | "secondary" | "draft" | "outline" | "default" | "destructive";
const statusMap: Record<
  string,
  { variant: BadgeVariant; label?: string }
> = {
  active: { variant: "success", label: "Active" },
  inactive: { variant: "secondary", label: "Inactive" },
  draft: { variant: "draft", label: "Draft" },
};


const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function WorkflowOptions({
  onEdit,
  onDelete,
  workflow,
}: {
  onEdit: (workflowId: string) => void;
  onDelete: (workflowId: string) => void;
  workflow: Workflow;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="p-1">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-40">
        <div className="flex flex-col space-y-2">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => onEdit(workflow.id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-destructive"
            onClick={() => onDelete(workflow.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function WorkflowSkeleton() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48 animate-shimmer" />
            <Skeleton className="h-4 w-64 animate-shimmer" />
          </div>
          <Skeleton className="h-6 w-16 animate-shimmer" />
        </div>
        <div className="mt-4 flex items-center">
          <Skeleton className="h-4 w-32 animate-shimmer" />
          <Skeleton className="h-4 w-4 mx-2 rounded-full animate-shimmer" />
          <Skeleton className="h-4 w-32 animate-shimmer" />
        </div>
      </Card>
    </motion.div>
  );
}

function UserWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [workflowToEdit, setWorkflowToEdit] = useState<Workflow | null>(null);

  const onEdit = async (updatedWorkflow: Workflow) => {
    try {
      const response = await fetch("/api/workflowUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedWorkflow),
      });

      if (!response.ok) {
        throw new Error("Failed to update workflow");
      }

      const result = await response.json();
      toast.success("Workflow updated successfully!");

      setWorkflows((prev) =>
        prev.map((workflow) => (workflow.id === result.id ? result : workflow))
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error updating workflow"
      );
    } finally {
      setIsEditDialogOpen(false);
      setWorkflowToEdit(null);
    }
  };

  const openEditDialog = (workflowId: string) => {
    const workflow = workflows.find((w) => w.id === workflowId);
    if (workflow) {
      setWorkflowToEdit(workflow);
      setIsEditDialogOpen(true);
    } else {
      toast.error("Workflow not found");
    }
  };

  const onDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/workflowDelete?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete workflow");
      }

      toast.success("Workflow deleted successfully!");
      setWorkflows((prev) => prev.filter((workflow) => workflow.id !== id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error deleting workflow"
      );
    } finally {
      setIsDeleteDialogOpen(false);
      setWorkflowToDelete(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setWorkflowToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const [quote, setQuote] = useState("");
  const quotes = [
    "Looks like your workflows are still in the waiting room. Ready to create your first one?",
    "No workflows found! Let's build your first automation masterpiece.",
    "Your workflow garden is empty. Time to plant your first automation seed!",
    "No workflows here yet. Let's get started and create something awesome!",
    "It's quiet in the workflow land. Create your first workflow to get things moving!",
  ];

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setIsLoading(true);
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw new Error("Please login to view workflows");
        }

        const { data: workflowsData, error: workflowsError } = await supabase
          .from("Workflow")
          .select("*")
          .eq("userId", user.id)
          .order("createdAt", { ascending: false });

        if (workflowsError) {
          throw workflowsError;
        }

        setWorkflows(workflowsData || []);
      } catch (error) {
        console.error("Failed to fetch workflows:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch workflows"
        );
        setError(
          error instanceof Error ? error.message : "Failed to fetch workflows"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkflows();
  }, [supabase]);

  const handleWorkflowCreated = (newWorkflow: Workflow) => {
    setWorkflows((prev) => [newWorkflow, ...prev]);
  };

  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  return (
    <div className="max-w-6xl container mx-auto mt-14">
      {isLoading && (
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {[...Array(3)].map((_, index) => (
            <WorkflowSkeleton key={index} />
          ))}
        </motion.div>
      )}

      {!isLoading && error && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full"
          >
            <Alert variant="destructive" className="w-full">
              <Terminal className="h-4 w-4 mr-2" />
              <div>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </div>
            </Alert>
          </motion.div>
        </AnimatePresence>
      )}

      {!isLoading && !error && workflows.length === 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full"
          >
            <Card className="w-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-start gap-4">
                  <div>
                    <div className="flex flex-row gap-2">
                      <h3 className="text-2xl font-bold">Workflow Wasteland</h3>
                      <div className="relative">
                        <Layers className="h-7 w-7 text-muted-foreground animate-pulse" />
                        <div className="absolute -top-2 -right-3 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full p-1 animate-bounce">
                          ?!
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{quote}</p>
                  </div>
                  <CreateWorkflowButton
                    triggerText="Create Your First Workflow"
                    onWorkflowCreated={handleWorkflowCreated}
                  />
                  <p className="text-sm mt-0 text-muted-foreground italic">
                    (No robots were harmed in the making of this message)
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}

      {!isLoading && !error && workflows.length > 0 && (
        <AnimatePresence>
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <CreateWorkflowButton
            triggerText="Create New Workflow"
            onWorkflowCreated={handleWorkflowCreated}
          />
          <p className="text-sm text-right">Note : Click on the Workflow Card to Launch the Playground</p>
          {workflows.map((workflow) => (
            <TooltipProvider key={workflow.id}>
              <motion.div
                layout
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="cursor-pointer"
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div
                        ref={cardRef}
                        className="relative flex flex-col gap-2 p-4 w-full rounded-lg transition-shadow duration-200 ease-in-out cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onMouseMove={handleMouseMove}
                        onClick={() => router.push(`/workflow/editor/${workflow.id}`)}
                      >
                        {/* Left Section */}
                        <div>
                          <Tooltip>
                            <TooltipTrigger>
                              <Badge className="flex text-[12px] items-center p-1 py-0">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{format(new Date(workflow.updatedAt), "PP")}</span>
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Last updated</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <CardTitle className="text-lg font-medium">
                          {workflow.name}
                          <p className="hidden md:inline opacity-70">: {workflow.description}</p>
                        </CardTitle>
                        
                        {isHovered && (
                          <div
                            className="absolute bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-medium shadow-sm"
                            style={{
                              left: `${mousePosition.x}px`,
                              top: `${mousePosition.y}px`,
                              transform: 'translate(-50%, -100%)',
                              zIndex: 10,
                              transition: 'opacity 0.2s',
                              opacity: 1,
                              pointerEvents: 'none',
                            }}
                          >
                            Launch Playground
                          </div>
                        )}
                      </div>

                      {/* Right Section: Badge and Options */}
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={statusMap[workflow.status]?.variant || "default"}
                          className="text-xs"
                        >
                          {statusMap[workflow.status]?.label || workflow.status}
                        </Badge>
                        <WorkflowOptions
                          onEdit={openEditDialog}
                          onDelete={onDelete}
                          workflow={workflow}
                        />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </motion.div>
            </TooltipProvider>
          ))}
        </motion.div>
      </AnimatePresence>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <DialogContent>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this workflow? This action cannot be undone.
          </DialogDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (workflowToDelete) {
                  onDelete(workflowToDelete);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Workflow Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent>
          <DialogTitle>Edit Workflow</DialogTitle>
          <DialogDescription>
            Update the details of your workflow.
          </DialogDescription>
          {workflowToEdit && (
            <EditWorkflowForm
              workflow={workflowToEdit}
              onCancel={() => setIsEditDialogOpen(false)}
              onSave={onEdit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserWorkflows;
