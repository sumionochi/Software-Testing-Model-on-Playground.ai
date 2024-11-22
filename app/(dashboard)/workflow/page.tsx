"use client"
import React, { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, Layers, Plus, Terminal } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button';
import CreateWorkflowButton from '@/components/CreateWorkflowButton';

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
}

function UserWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const [quote, setQuote] = useState('')
  const quotes = [
    "Looks like your workflows are still in the waiting room. Ready to create your first one?",
    "No workflows found! Let’s build your first automation masterpiece.",
    "Your workflow garden is empty. Time to plant your first automation seed!",
    "No workflows here yet. Let’s get started and create something awesome!",
    "It’s quiet in the workflow land. Create your first workflow to get things moving!"
  ]

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          throw new Error('Please login to view workflows');
        }

        // Fetch workflows
        const { data: workflowsData, error: workflowsError } = await supabase
          .from('Workflow')
          .select('*')
          .eq('userId', user.id)
          .order('createdAt', { ascending: false });

        if (workflowsError) {
          throw workflowsError;
        }

        setWorkflows(workflowsData || []);
      } catch (error) {
        console.error('Failed to fetch workflows:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch workflows');
      }
    }

    fetchWorkflows();
  }, [supabase]);

  if (error) {
    return (
      <Alert variant="destructive" className="w-full">
        <Terminal className="h-4 w-4 mr-2" />
        <div>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </div>
      </Alert>
    );
  }

  if (!workflows.length) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex flex-col items-start">
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
            <div className="w-full max-w-[200px] h-2 bg-muted rounded-full overflow-hidden">
              <div className="w-0 h-full bg-primary animate-[grow_2s_ease-in-out_infinite]" />
            </div>
            <CreateWorkflowButton triggerText="Create Your First Workflow" />
            <p className="text-sm mt-2 text-muted-foreground italic">
              (No robots were harmed in the making of this message)
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <Card key={workflow.id} className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium text-lg">{workflow.name}</h3>
              {workflow.description && (
                <p className="text-muted-foreground">{workflow.description}</p>
              )}
            </div>
            <span className={`px-2 py-1 rounded-full text-sm ${
              workflow.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {workflow.status}
            </span>
          </div>
          <div className="mt-4 flex items-center text-sm text-muted-foreground">
            <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>Last updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-32 w-full rounded-lg" />
      ))}
    </div>
  );
}

function Workflows() {
  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
      </div>

      <div className="h-full py-4">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

export default Workflows;
