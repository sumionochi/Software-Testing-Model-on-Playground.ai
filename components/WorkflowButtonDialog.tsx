"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Layers2Icon, Waypoints } from "lucide-react";

interface Props {
  title?: string;
  subTitle?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

function WorkflowButtonDialog(props: Props) {
  return (
    <DialogHeader className="py-0">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          <Waypoints className="w-7 h-7 text-rose-500"/>

          {props.title && (
            <h2 className={props.titleClassName || "text-xl font-bold"}>
              {props.title}
            </h2>
          )}

          {props.subTitle && (
            <p className={props.subtitleClassName || "text-sm"}>
              {props.subTitle}
            </p>
          )}        
        </div>
      </DialogTitle>
    </DialogHeader>
  );
}

export default WorkflowButtonDialog;
