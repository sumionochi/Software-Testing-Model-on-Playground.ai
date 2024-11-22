import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers2Icon, PencilLine, Plus } from "lucide-react";
import WorkflowButtonDialog from "./WorkflowButtonDialog";
import { useForm } from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod"
import { createWorkFlowForm } from "@/schema/workflowForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "./ui/input";

function CreateWorkflowButton({ triggerText }: { triggerText?: string }) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof createWorkFlowForm>>({
    resolver: zodResolver(createWorkFlowForm),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof createWorkFlowForm>) => {
    setOpen(false);
    form.reset();
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (optional)</FormLabel>
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
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brief description on what your workflow is about." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="mt-2"><PencilLine className="w-5 h-5"/>Let's Create</Button>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateWorkflowButton;
