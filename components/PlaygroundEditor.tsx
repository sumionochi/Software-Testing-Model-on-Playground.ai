"use client";

import { Workflow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowPlaygroundEditor from "./FlowPlaygroundEditor";
import Topbar from "./WorkflowTopBar/Topbar";

function PlaygroundEditor({ workflow }: { workflow: Workflow }) {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Topbar title={workflow.name} subtitle={workflow.description} WorkflowId={workflow.id}/>
        <section className="flex h-full overflow-hidden">
          <FlowPlaygroundEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
}

export default PlaygroundEditor;
