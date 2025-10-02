import { Monitor, Moon, Sun } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { themes, useTheme } from "@/components/themes/theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
	const { theme, setTheme } = useTheme();

	return (
		<ToggleGroup
			type="single"
			value={theme}
			onValueChange={(value) => {
				if (value) setTheme(value as "light" | "dark" | "system");
			}}
			variant="outline"
			size="sm"
			className={className}
		>
			{themes.map((theme) => (
				<ToggleGroupItem value={theme} aria-label={theme} key={theme}>
					{theme === "light" ? (
						<Sun className="h-4 w-4" />
					) : theme === "dark" ? (
						<Moon className="h-4 w-4" />
					) : (
						<Monitor className="h-4 w-4" />
					)}
					<span className="sr-only">
						{theme.charAt(0).toUpperCase() + theme.slice(1)}
					</span>
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
