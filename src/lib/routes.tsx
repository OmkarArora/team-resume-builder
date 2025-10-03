import React from "react";
import Dashboard from "../pages/Dashboard.tsx";
import ResumeView from "../pages/ResumeView.tsx";
import ResumeEdit from "../pages/ResumeEdit.tsx";
import ResumeNew from "../pages/ResumeNew.tsx";
import Team from "../pages/Team.tsx";
import TeamMember from "../pages/TeamMember.tsx";

import {
	IconDashboard,
	IconUsers,
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
		element: <Team />,
		icon: <IconUsers />,
		description: "Team management and collaboration",
	},
];

// Resume-specific routes (not shown in sidebar)
export const resumeRoutes: RouteConfig[] = [
	{
		path: "/resume/new",
		title: "New Resume",
		element: <ResumeNew />,
		icon: <IconEdit />,
		description: "Create new resume",
	},
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
	{
		path: "/team/:id",
		title: "Team Member",
		element: <TeamMember />,
		icon: <IconUsers />,
		description: "View team member",
	},
];

// Utility functions for working with routes
export const getRouteByPath = (path: string): RouteConfig | undefined => {
	return routeConfig.find((route) => route.path === path);
};

export const getRouteTitle = (path: string): string => {
	// First check main routes
	const route = getRouteByPath(path);
	if (route) {
		return route.title;
	}

	// Check resume routes for exact matches
	const resumeRoute = resumeRoutes.find((route) => route.path === path);
	if (resumeRoute) {
		return resumeRoute.title;
	}

	// Handle dynamic routes with parameters
	// Check for resume view/edit patterns: /resume/:id and /resume/:id/edit
	const resumeViewMatch = path.match(/^\/resume\/([^\/]+)$/);
	if (resumeViewMatch) {
		return "Resume Details";
	}

	const resumeEditMatch = path.match(/^\/resume\/([^\/]+)\/edit$/);
	if (resumeEditMatch) {
		return "Edit Resume";
	}

	// Check for team member view pattern: /team/:id
	const teamMemberMatch = path.match(/^\/team\/([^\/]+)$/);
	if (teamMemberMatch) {
		return "Team Member Details";
	}

	return "Unknown Page";
};

// Export all routes for React Router (main routes + resume routes)
export const routes = [
	...routeConfig.map(({ path, element }) => ({ path, element })),
	...resumeRoutes.map(({ path, element }) => ({ path, element })),
];
