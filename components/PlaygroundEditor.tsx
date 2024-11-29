"use client";

import { Workflow } from "@prisma/client";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
import FlowPlaygroundEditor from "./FlowPlaygroundEditor";

function PlaygroundEditor({ workflow }: { workflow: Workflow }) {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <section className="flex h-full overflow-hidden">
          <FlowPlaygroundEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
}

export default PlaygroundEditor;
