"use client";

import { Workflow } from "@prisma/client";
import React, { useEffect } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { createClient } from "@/utils/supabase/client";
import FlowPlaygroundEditor from "./FlowPlaygroundEditor";
import TaskMenu from "./TaskMenu";

function PlaygroundEditorTrial({ workflow }: { workflow: Workflow }) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // If the user is logged in, redirect to "/"
      if (user) {
        router.push("/");
      }
    };

    checkUser();
  }, [supabase, router]);

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
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

export default PlaygroundEditorTrial;
