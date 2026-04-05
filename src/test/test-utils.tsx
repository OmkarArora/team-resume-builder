import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

export function renderWithProviders(ui: ReactElement) {
	return render(ui, {
		wrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
	});
}
