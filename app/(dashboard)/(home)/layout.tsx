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
                <div className="flex flex-col flex-1 w-full">
                    <header className="flex flex-row items-center justify-between gap-2 px-2 h-14">
                        <div className="flex items-center px-4 justify-between w-full max-w-6xl mx-auto">
                            <UserProfile />
                            <div className="flex flex-row items-center">
                            </div>
                            <SidebarTrigger />
                        </div>
                    </header>
                    <Separator />
                    <div className="overflow-auto">
                        <div className="container flex-1 p-4 py-4 text-accent-foreground max-w-6xl mx-auto">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </IsAuthorised>
    );
}

export default layout;
