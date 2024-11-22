import { AppSidebar } from "@/components/AppSidebar";
import { UserProfile } from "@/components/UserProfile";
import IsAuthorised from "@/components/isAuthorised";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
    return (
        <IsAuthorised>
            <div className="flex h-screen w-full">
                <div className="flex flex-col flex-1 min-h-screen">
                    <header className="flex flex-row items-center justify-between gap-2 px-2 pr-2 h-12">
                        <UserProfile/>
                        <div className="flex flex-row items-center">
                            <AppSidebar />
                            <SidebarTrigger />
                        </div>                 
                    </header>
                    <Separator />
                    <div className="overflow-auto">
                        <div className="flex-1 container p-4 py-4 text-accent-foreground max-w-6xl mx-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </IsAuthorised>
    );
}

export default layout;