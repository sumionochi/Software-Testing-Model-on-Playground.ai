import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";

function NodeCard({
  nodeId,
  isSelected,
  children,
}: {
  nodeId: string;
  isSelected: boolean;
  children: ReactNode;
}) {
  const { getNode, setCenter } = useReactFlow();

  return (
    <div
    onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
      
        const { position, measured } = node;
        if (!position || !measured) return;
      
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
      
        if (x === undefined || y === undefined) return;
      
        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      
      className={cn(
        "rounded-md cursor-pointer bg-background hover:border-teal-500 border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary"
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard;
