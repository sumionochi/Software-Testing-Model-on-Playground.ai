"use client";

import { ParamProps, TaskParam } from "@/schema/playgroundTask";
import React from "react";

export default function BrowserInstanceParam({ param }: ParamProps) {
  return <p className="text-xs">{param.name}</p>;
}
