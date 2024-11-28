import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PencilLine, Plus } from "lucide-react";
import WorkflowButtonDialog from "./WorkflowButtonDialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateWorkFlowFormType, createWorkFlowForm } from "@/schema/workflowForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";
import { useProfile } from "@/hooks/profileProvider";
import { toast } from 'sonner';
import { useRouter } from "next/navigation";

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateWorkflowButtonProps {
  triggerText?: string;
  onWorkflowCreated?: (workflow: Workflow) => void; 
}

function CreateWorkflowButton({ triggerText, onWorkflowCreated }: CreateWorkflowButtonProps) {
  const [open, setOpen] = useState(false);
  const { profile, loading } = useProfile();
  const router = useRouter();

  const form = useForm<CreateWorkFlowFormType>({
    resolver: zodResolver(createWorkFlowForm),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateWorkFlowFormType) => {
    try {
      const response = await fetch("/api/workflowUpload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          userId: profile.id, 
          definition: "Todo", 
          status: "Draft"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workflow");
      }

      const result = await response.json();
      console.log("Workflow created successfully:", result);

      toast.success("Workflow created successfully!");

      setOpen(false);
      form.reset();

      router.push(`/workflow/editor/${result.id}`);

      if (onWorkflowCreated) {
        onWorkflowCreated(result);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating workflow");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          {triggerText ?? "Create your first workflow"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <WorkflowButtonDialog
          title="Create workflow"
          subTitle="Start building your workflow"
        />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive Name." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a brief description of your workflow."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-2">
              <PencilLine className="w-5 h-5" />
              Let's Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkflowButton;
