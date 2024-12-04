import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2, ChevronRight, ChevronDown, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { TaskOutputRenderer } from './TaskOutputRenderer'

interface TaskResult {
  id: string
  label: string
  status: "pending" | "completed" | "error"
  output: null | Record<string, any>
}

export interface WorkflowExecution {
  id: string
  timestamp: Date
  status: "running" | "completed" | 'error'
  results: TaskResult[]
}

interface WorkflowResultsDialogProps {
  isOpen: boolean
  onClose: () => void
  executions: WorkflowExecution[]
}

export default function WorkflowResultsDialog({ isOpen, onClose, executions }: WorkflowResultsDialogProps) {
  const [expandedExecutions, setExpandedExecutions] = useState<Set<string>>(new Set())
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const toggleExecution = (executionId: string) => {
    setExpandedExecutions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(executionId)) {
        newSet.delete(executionId)
      } else {
        newSet.add(executionId)
      }
      return newSet
    })
  }

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(taskId)) {
        newSet.delete(taskId)
      } else {
        newSet.add(taskId)
      }
      return newSet
    })
  }

  const getStatusIcon = (status: TaskResult['status'] | WorkflowExecution['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-500 h-5 w-5" />
      case 'error':
        return <XCircle className="text-red-500 h-5 w-5" />
      case 'pending':
      case 'running':
        return <Loader2 className="text-yellow-500 h-5 w-5 animate-spin" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Workflow Execution History</DialogTitle>
          <DialogDescription>
            View the results of all workflow executions, including the current one.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
          {executions.length > 0 ? (
            executions.map((execution) => (
              <div key={execution.id} className="mb-6 last:mb-0 border-b pb-4 last:border-b-0">
                <div 
                  className="flex items-center space-x-2 cursor-pointer mb-2"
                  onClick={() => toggleExecution(execution.id)}
                >
                  {getStatusIcon(execution.status)}
                  <h3 className="font-semibold text-lg flex-grow">
                    Execution {format(execution.timestamp, 'yyyy-MM-dd HH:mm:ss')}
                  </h3>
                  {expandedExecutions.has(execution.id) ? (
                    <ChevronDown className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-5 w-5" />
                  )}
                </div>
                {expandedExecutions.has(execution.id) && (
                  <div className="pl-7 space-y-4">
                    {execution.results.map((task) => (
                      <div key={task.id}>
                        <div 
                          className="flex items-center space-x-2 cursor-pointer mb-2"
                          onClick={() => toggleTask(task.id)}
                        >
                          {getStatusIcon(task.status)}
                          <h4 className="font-medium text-md flex-grow">{task.label}</h4>
                          {expandedTasks.has(task.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </div>
                        {expandedTasks.has(task.id) && task.output && (
                          <div className="mt-2">
                            <TaskOutputRenderer taskType={task.label} output={task.output} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No executions to display. Please run a workflow first.</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}