import React from "react";
import Dashboard from "../pages/Dashboard.tsx";
import ResumeView from "../pages/ResumeView.tsx";
import ResumeEdit from "../pages/ResumeEdit.tsx";

import {
	IconDashboard,
	IconFolder,
	IconListDetails,
	IconUsers,
	IconChartBar,
	IconEye,
	IconEdit,
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
	// {
	// 	path: "/lifecycle",
	// 	title: "Lifecycle",
	// 	element: <div>Lifecycle</div>,
	// 	icon: <IconListDetails />,
	// 	description: "Project lifecycle management",
	// },
	// {
	// 	path: "/analytics",
	// 	title: "Analytics",
	// 	element: <div>Analytics</div>,
	// 	icon: <IconChartBar />,
	// 	description: "Data analytics and insights",
	// },
	// {
	// 	path: "/projects",
	// 	title: "Projects",
	// 	element: <div>Projects</div>,
	// 	icon: <IconFolder />,
	// 	description: "Project management",
	// },
	{
		path: "/team",
		title: "Team",
		element: <div>Team</div>,
		icon: <IconUsers />,
		description: "Team management and collaboration",
	},
];

// Resume-specific routes (not shown in sidebar)
export const resumeRoutes: RouteConfig[] = [
	{
		path: "/resume/:id",
		title: "View Resume",
		element: <ResumeView />,
		icon: <IconEye />,
		description: "View resume details",
	},
	{
		path: "/resume/:id/edit",
		title: "Edit Resume",
		element: <ResumeEdit />,
		icon: <IconEdit />,
		description: "Edit resume information",
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

// Export all routes for React Router (main routes + resume routes)
export const routes = [
	...routeConfig.map(({ path, element }) => ({ path, element })),
	...resumeRoutes.map(({ path, element }) => ({ path, element })),
];
