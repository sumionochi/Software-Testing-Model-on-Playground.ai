import { AppSidebar } from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";
import { UserProfile } from "@/components/UserProfile";
import IsAuthorised from "@/components/isAuthorised";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex h-screen w-full">
                <div className="flex flex-col flex-1 w-full">
                    <Separator />
                    <div className="overflow-auto">
                        <div className="flex-1 text-accent-foreground">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default layout;
