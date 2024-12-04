import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";

interface Props {
  title: string;
  subtitle?: string | null;
  workflowId: string;
}

export default function Topbar({ title, subtitle }: Props) {
  const router = useRouter();
  return (
    <header className="flex items-center p-2 shadow-md justify-between w-full h-[60px] sticky top-0 bg-background z-10">
        <div className="flex gap-1 flex-1">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ChevronLeftIcon size={20} />
            </Button>
            <div className="flex flex-col">
                <p className="font-bold text-ellipsis truncate">{title}</p>
                {subtitle && (
                <p className="text-xs text-muted-foreground truncate text-ellipsis">
                    {subtitle}
                </p>
                )}
            </div>
        </div>
        <div className="flex gap-1 flex-1 justify-end">
       </div>
      <SidebarTrigger/>
    </header>
  );
}
