"use client";
import { Link, useLocation } from "react-router";
import { Home, Target } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "~/components/ui/sidebar";

// Navigation items data
const navigationItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
    },

    {
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: Target,
    },
];

export default function LayoutSidebar() {
    const location = useLocation();

    return (
        <SidebarProvider>
            <Sidebar className="border-r">
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navigationItems.map((item) => {
                                    const isActive =
                                        location.pathname === item.url;

                                    return (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive}
                                            >
                                                <Link
                                                    to={item.url}
                                                    className="flex items-center gap-2"
                                                >
                                                    <item.icon className="h-4 w-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>

            {/* Mobile trigger button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <SidebarTrigger className="h-8 w-8" />
            </div>
        </SidebarProvider>
    );
}
