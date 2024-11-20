import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen w-full">
            <div className="flex flex-col flex-1 min-h-screen">
                <header className="flex items-center justify-between px-2 pr-4 h-12">
                    <SidebarTrigger />
                    workFlowPlayground.AI
                </header>
                <Separator />
                <div className="overflow-auto">
                    <div className="flex-1 container p-4 py-4 text-accent-foreground">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default layout;