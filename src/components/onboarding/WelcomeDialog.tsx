import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rocket, Users, FileText, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useOnboardingStore } from "@/lib/store";

interface WelcomeDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onStartWalkthrough: () => void;
	isReturningUser?: boolean;
}

export function WelcomeDialog({
	open,
	onOpenChange,
	onStartWalkthrough,
	isReturningUser = false,
}: WelcomeDialogProps) {
	const navigate = useNavigate();
	const location = useLocation();
	const [isStarting, setIsStarting] = useState(false);

	const completeOnboarding = useOnboardingStore(
		(state) => state.completeOnboarding
	);

	function skipOrClose() {
		completeOnboarding();
		onOpenChange(false);
	}

	const handleStartJourney = async () => {
		setIsStarting(true);

		// If user is on team page, redirect to dashboard first
		if (location.pathname === "/team") {
			console.log("Redirecting from team page to dashboard for tour");
			navigate("/");
			// Small delay to ensure navigation completes
			await new Promise((resolve) => setTimeout(resolve, 300));
		}

		// Small delay for better UX
		await new Promise((resolve) => setTimeout(resolve, 300));
		onStartWalkthrough();
		setIsStarting(false);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-md"
				onPointerDownOutside={skipOrClose}
				showCloseButton={false}
			>
				<DialogHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<Rocket className="h-8 w-8 text-primary" />
					</div>
					<DialogTitle className="text-2xl font-bold text-center">
						{isReturningUser
							? "About Team Resume Builder"
							: "Welcome to Team Resume Builder!"}
					</DialogTitle>
					<DialogDescription className="text-base text-center">
						{isReturningUser
							? "Take a quick tour to refresh your memory about the platform features"
							: "Let's get you started with a quick tour of the platform"}
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="space-y-3">
						<div className="flex items-center gap-3 text-sm">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
								<FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
							</div>
							<span>Create and manage professional resumes</span>
						</div>
						<div className="flex items-center gap-3 text-sm">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
								<Users className="h-4 w-4 text-green-600 dark:text-green-400" />
							</div>
							<span>Collaborate with your team members</span>
						</div>
						<div className="flex items-center gap-3 text-sm">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
								<Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
							</div>
							<span>Export beautiful PDF resumes</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-2">
					<Button
						onClick={handleStartJourney}
						disabled={isStarting}
						className="w-full"
						size="lg"
					>
						{isStarting ? (
							<>
								<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								{isReturningUser ? "Starting Tour..." : "Starting Journey..."}
							</>
						) : (
							<>
								<Rocket className="mr-2 h-4 w-4" />
								{isReturningUser ? "Watch Tour Again" : "Start Journey"}
							</>
						)}
					</Button>
					<Button
						variant="ghost"
						onClick={skipOrClose}
						disabled={isStarting}
						className="w-full"
					>
						{isReturningUser ? "Close" : "Skip for now"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
