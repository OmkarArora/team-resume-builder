import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from "./App.tsx";

import { BrowserRouter, Route, Routes } from "react-router";

import { ThemeProvider } from "./components/themes/theme-provider.tsx";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/app-sidebar.tsx";
import { SiteHeader } from "./components/site-header.tsx";
import { routes } from "./lib/routes";
import { Toaster } from "sonner";
import { initializeStore } from "./lib/hooks";

// Initialize store with mock data when app starts
initializeStore();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="trb-ui-theme">
			<BrowserRouter>
				<RootLayout>
					<Routes>
						{routes.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.element}
							/>
						))}
					</Routes>
				</RootLayout>
			</BrowserRouter>

			<Toaster />
		</ThemeProvider>
	</StrictMode>
);

function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 56)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<SiteHeader />
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}

// TODO
/**
 1. Team Page
 2. CRUD operations for team members
 3. Add a team member
 4. Edit a team member
 5. Delete a team member
 6. View a team member
 7. View a team member's resume
 8. Edit a team member's resume
 9. Delete a team member's resume
 10. Team members store
 11. Connect Team member and Resume with ID
 12. Add page navigation block with user has unsaved changes in resume edit page
 */
