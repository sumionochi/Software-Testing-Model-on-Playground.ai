'use client'

import { ArrowUpDown, Home, Key, Receipt, Settings } from 'lucide-react'
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Separator } from './ui/separator'

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Workflows",
    url: "#",
    icon: ArrowUpDown,
  },
  {
    title: "Credentials",
    url: "#",
    icon: Key,
  },
  {
    title: "Billing",
    url: "#",
    icon: Receipt,
  },
]

export function AppSidebar() {
  const [activeIndex, setActiveIndex] = useState(0)
  return (
    <Sidebar className="border-r-0">
        <SidebarHeader className="h-auto border-b-0 p-3 px-4">
          <div className="flex items-center gap-2 text-sidebar-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-rose-500 text-white">
              <Settings className="h-4 w-4" />
            </div>
            <span className="font-semibold">FlowScrape</span>
          </div>
        </SidebarHeader>
        <Separator/>
        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeIndex === index}
                      className="h-10 [&[data-active=true]]:bg-rose-500 [&[data-active=true]]:text-rose-50"
                      onClick={() => setActiveIndex(index)}
                    >
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
  )
}