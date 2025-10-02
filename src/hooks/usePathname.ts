import { useMemo } from "react";
import { useLocation } from "react-router";

export default function usePathname() {
	const location = useLocation();
	return useMemo(() => location.pathname, [location.pathname]);
}
