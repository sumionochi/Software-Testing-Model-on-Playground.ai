"use client";

import { ReactNode } from "react";

function NodeCard({
  children,
  nodeId,
}: {
  nodeId: string;
  children: ReactNode;
}) {
  return <div>{children}</div>;
}

export default NodeCard;
