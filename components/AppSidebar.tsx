'use client'

import { ArrowUpDown, Home, Key, Receipt, Settings, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

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
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Separator } from './ui/separator'

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Workflows",
    url: "/workflow",
    icon: ArrowUpDown,
  },
  {
    title: "Credentials",
    url: "/credentials", 
    icon: Key,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: Receipt,
  },
]

export function AppSidebar() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div>
      <Sidebar side="right" collapsible="offcanvas" className="border-r-0">
        <SidebarHeader className="h-auto border-b-0 p-3.5 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sidebar-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-rose-500 text-white">
                <Settings className="h-4 w-4" />
              </div>
              <span className="font-semibold">Playground.ai</span>
            </div>
            {/* Sidebar Toggle */}
            <SidebarTrigger/>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="p-2">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => {
                  const isActive =
                    item.url === '/'
                      ? pathname === item.url
                      : pathname.startsWith(item.url)
                  return (
                    <SidebarMenuItem key={index} className="py-1">
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={`h-10 ${
                          isActive
                            ? 'bg-rose-500 rounded-md text-rose-50'
                            : 'text-gray-700 hover:text-white rounded-md hover:bg-rose-500 dark:text-gray-300 dark:hover:bg-rose-700'
                        }`}
                      >
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
                {/* Dark Mode Toggle Button */}
                <SidebarMenuItem className="py-1">
                  <SidebarMenuButton
                    asChild
                    className="h-10 text-gray-700 hover:text-white rounded-md hover:bg-rose-500 dark:text-gray-300 dark:hover:bg-rose-700"
                  >
                    <button onClick={toggleTheme} className="flex items-center gap-2">
                      {theme === 'dark' ? (
                        <>
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <span className=''>Turn on Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4" />
                          <span>Turn on Dark Mode</span>
                        </>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </div>
  )
}