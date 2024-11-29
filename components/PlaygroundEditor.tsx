"use client";

import { Workflow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowPlaygroundEditor from "./FlowPlaygroundEditor";
import Topbar from "./WorkflowTopBar/Topbar";
import TaskMenu from "./TaskMenu";

function PlaygroundEditor({ workflow }: { workflow: Workflow }) {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Topbar title={workflow.name} subtitle={workflow.description} WorkflowId={workflow.id}/>
        <div className="flex h-full overflow-hidden">
          <TaskMenu />
          <section className="flex-1 overflow-hidden">
            <FlowPlaygroundEditor workflow={workflow} />
          </section>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default PlaygroundEditor;

