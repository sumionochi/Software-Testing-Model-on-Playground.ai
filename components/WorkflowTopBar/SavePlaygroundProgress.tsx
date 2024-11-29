"use client";

import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon, SaveIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface Props {
  workflowId: string;
}

export default function SaveBtn({ workflowId }: Props) {
  const { toObject } = useReactFlow();
  const [isSaved, setIsSaved] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (workflowData: { id: string; definition: string }) => {
      const response = await fetch("/api/workflowInPlaygroundUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      });
      if (!response.ok) throw new Error("Failed to save workflow");
    },
    onSuccess: () => {
      toast.success("Flow saved successfully!", { id: "save-workflow" });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000); 
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });

  const handleSave = () => {
    const workflowDefinition = JSON.stringify(toObject());
    toast.loading("Saving workflow...", { id: "save-workflow" });
    saveMutation.mutate({
      id: workflowId,
      definition: workflowDefinition,
    });
  };

  return (
    <Button
      variant="outline"
      disabled={saveMutation.isPending}
      className="relative overflow-hidden"
      onClick={handleSave}
    >
      <motion.div
        className="flex items-center gap-2 px-4 py-2"
        initial={false}
        animate={{
          x: isSaved ? -40 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <SaveIcon size={16} className="stroke-primary" />
        Save
      </motion.div>
      <AnimatePresence>
        {isSaved && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-500"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <CheckIcon size={16} className="stroke-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}
