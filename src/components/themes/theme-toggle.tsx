import { Monitor, Moon, Sun } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { themes, useTheme } from "@/components/themes/theme-provider";
import { cn } from "@/lib/utils";

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
			className={cn("w-full", className)}
		>
			{themes.map((theme) => (
				<ToggleGroupItem
					className="w-full"
					value={theme}
					aria-label={theme}
					key={theme}
				>
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
