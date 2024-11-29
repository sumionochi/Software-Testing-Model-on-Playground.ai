"use client";

import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "../ui/button";

export default function DeleteEdge(props: EdgeProps) {
  console.log('DeleteEdge component rendered with props:', props); // For debugging
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all', // Ensure pointer events are enabled
          }}
        >
          <Button
            variant="outline"
            size="icon"
            className="w-5 h-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg"
            onClick={() => {
              console.log("Deleting edge with ID:", props.id);
              setEdges((edges) => {
                console.log("Current edges before delete:", edges);
                const updatedEdges = edges.filter(
                  (edge) => edge.id !== props.id
                );
                console.log("Updated edges after delete:", updatedEdges);
                return updatedEdges;
              });
            }}
          >
            x
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
