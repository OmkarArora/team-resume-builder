import { useCallback } from "react";
import { useNavigate } from "react-router";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "./use-mobile";

/**
 * Custom hook for handling navigation on mobile devices.
 * Automatically closes the sidebar when navigating to a new route on mobile.
 */
export function useMobileNavigation() {
	const navigate = useNavigate();
	const { isMobile, setOpenMobile } = useSidebar();
	const isMobileDevice = useIsMobile();

	const navigateWithSidebarClose = useCallback(
		(to: string) => {
			// Navigate to the new route
			navigate(to);

			// Close sidebar on mobile devices
			if (isMobileDevice && isMobile) {
				setOpenMobile(false);
			}
		},
		[navigate, isMobileDevice, isMobile, setOpenMobile]
	);

	return {
		navigateWithSidebarClose,
		isMobile: isMobileDevice && isMobile,
	};
}
