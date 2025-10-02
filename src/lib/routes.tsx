import React from "react";
import Dashboard from "../pages/Dashboard.tsx";

import {
	IconDashboard,
	IconFolder,
	IconListDetails,
	IconUsers,
	IconChartBar,
} from "@tabler/icons-react";

export interface RouteConfig {
	path: string;
	title: string;
	element: React.ReactNode;
	icon: React.ReactNode;
	description?: string;
}

export const routeConfig: RouteConfig[] = [
	{
		path: "/",
		title: "Dashboard",
		element: <Dashboard />,
		icon: <IconDashboard />,
		description: "Overview and main dashboard",
	},
	{
		path: "/lifecycle",
		title: "Lifecycle",
		element: <div>Lifecycle</div>,
		icon: <IconListDetails />,
		description: "Project lifecycle management",
	},
	{
		path: "/analytics",
		title: "Analytics",
		element: <div>Analytics</div>,
		icon: <IconChartBar />,
		description: "Data analytics and insights",
	},
	{
		path: "/projects",
		title: "Projects",
		element: <div>Projects</div>,
		icon: <IconFolder />,
		description: "Project management",
	},
	{
		path: "/team",
		title: "Team",
		element: <div>Team</div>,
		icon: <IconUsers />,
		description: "Team management and collaboration",
	},
];

// Utility functions for working with routes
export const getRouteByPath = (path: string): RouteConfig | undefined => {
	return routeConfig.find((route) => route.path === path);
};

export const getRouteTitle = (path: string): string => {
	const route = getRouteByPath(path);
	return route?.title || "Unknown Page";
};

// Export just the routes for React Router
export const routes = routeConfig.map(({ path, element }) => ({
	path,
	element,
}));
