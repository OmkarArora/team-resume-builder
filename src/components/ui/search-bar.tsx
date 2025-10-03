import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	ariaLabel?: string;
	className?: string;
}

export function SearchBar({
	value,
	onChange,
	placeholder = "Search...",
	ariaLabel,
	className = "w-[200px] md:w-[260px]",
}: SearchBarProps) {
	return (
		<div className={`relative ${className}`}>
			<Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				aria-label={ariaLabel || placeholder}
				className="pl-8"
			/>
		</div>
	);
}
