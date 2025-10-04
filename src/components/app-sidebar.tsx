import * as React from "react";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./themes/theme-toggle";
import { routeConfig } from "@/lib/routes";
import { useOnboardingStore } from "@/lib/store";
import { Info } from "lucide-react";

import { NavLink } from "react-router";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const showWelcome = useOnboardingStore((state) => state.showWelcome);

	return (
		<Sidebar collapsible="offcanvas" data-tour="sidebar" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<NavLink to="/" title="Team Resume Builder">
								<img
									src="/android-chrome-192x192.png"
									alt="Team Resume Builder"
									className="!size-5"
								/>
								<span className="text-base font-semibold">TRB</span>
							</NavLink>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu className="px-2 pt-2">
					{routeConfig.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuButton tooltip={item.title} asChild>
								<NavLink
									to={item.path}
									data-tour={item.path === "/team" ? "team-section" : undefined}
									className={
										"focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
									}
								>
									{item.icon}
									{item.title}
								</NavLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}

					<SidebarMenuItem>
						<SidebarMenuButton onClick={showWelcome} tooltip="About">
							<Info />
							About
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<ThemeToggle className="mt-auto" />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
