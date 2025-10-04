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
import { OnboardingManager } from "./components/onboarding/OnboardingManager";

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
				<OnboardingManager />
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
