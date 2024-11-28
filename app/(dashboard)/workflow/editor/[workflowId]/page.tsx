"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client"; 
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import PlaygroundEditor from "@/components/PlaygroundEditor";

const Playground = ({ params }: { params: { workflowId: string } }) => {
  const supabase = createClient(); 

  const { workflowId } = params;
  console.log("workflowId:", workflowId);

  const [workflow, setWorkflow] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workflowId) {
      setError("No workflowId provided in the URL.");
      return;
    }

    const fetchWorkflow = async () => {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from("Workflow")
          .select("*")
          .eq("id", workflowId)
          .single();

        if (error) throw error;

        setWorkflow(data);
      } catch (err) {
        console.error("Error fetching workflow:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch workflow");
        toast.error(err instanceof Error ? err.message : "Failed to fetch workflow");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflow();
  }, [workflowId, supabase]);

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-100 text-red-800">
          <CardContent>
            <CardTitle>Error</CardTitle>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PlaygroundEditor workflow={workflow}/>
  );
};

export default Playground;
