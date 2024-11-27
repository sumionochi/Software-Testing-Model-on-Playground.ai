"use client"

import React, { Suspense, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Layers, Plus, Terminal } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import CreateWorkflowButton from '@/components/CreateWorkflowButton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner'; 

interface Workflow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  definition: string;
  createdAt: string;
  updatedAt: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0 }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

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

  const [quote, setQuote] = useState('')
  const quotes = [
    "Looks like your workflows are still in the waiting room. Ready to create your first one?",
    "No workflows found! Let's build your first automation masterpiece.",
    "Your workflow garden is empty. Time to plant your first automation seed!",
    "No workflows here yet. Let's get started and create something awesome!",
    "It's quiet in the workflow land. Create your first workflow to get things moving!"
  ]

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)])
  }, [])

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        setIsLoading(true);
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
        // Replace console.error with Sonner's toast
        toast.error(error instanceof Error ? error.message : 'Failed to fetch workflows');
        setError(error instanceof Error ? error.message : 'Failed to fetch workflows');
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkflows();
  }, [supabase]);

  const handleWorkflowCreated = (newWorkflow: Workflow) => {
    setWorkflows(prev => [newWorkflow, ...prev]); 
  };

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!workflows.length) {
    return (
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
                {/* Pass the callback to CreateWorkflowButton */}
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
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Optionally, include CreateWorkflowButton here as well */}
        <CreateWorkflowButton 
          triggerText="Create New Workflow" 
          onWorkflowCreated={handleWorkflowCreated} 
        />
        {workflows.map((workflow) => (
          <motion.div
            key={workflow.id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Card className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-medium text-lg">{workflow.name}</h3>
                  {workflow.description && (
                    <p className="text-muted-foreground">{workflow.description}</p>
                  )}
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-sm ${
                    workflow.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {workflow.status}
                </span>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span>Created {new Date(workflow.createdAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>Last updated {new Date(workflow.updatedAt).toLocaleDateString()}</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}

export default UserWorkflows;
