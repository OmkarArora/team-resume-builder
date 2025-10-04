import { useEffect, useState } from "react";
import { WelcomeDialog } from "./WelcomeDialog";
import { OnboardingWalkthrough } from "./OnboardingWalkthrough";
import { useOnboardingStore } from "@/lib/store";

interface OnboardingManagerProps {
	forceShowWelcome?: boolean;
}

export function OnboardingManager({
	forceShowWelcome = false,
}: OnboardingManagerProps) {
	const {
		hasCompletedOnboarding,
		showWelcomeDialog,
		showWelcome,
		hideWelcome,
		completeOnboarding,
	} = useOnboardingStore();

	const [isWalkthroughActive, setIsWalkthroughActive] = useState(false);

	// Show welcome dialog for first-time users or when forced
	useEffect(() => {
		if (forceShowWelcome && !showWelcomeDialog && !isWalkthroughActive) {
			showWelcome();
		} else if (
			!hasCompletedOnboarding &&
			!showWelcomeDialog &&
			!isWalkthroughActive
		) {
			// Small delay to ensure the app is fully loaded
			const timer = setTimeout(() => {
				showWelcome();
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [
		hasCompletedOnboarding,
		showWelcomeDialog,
		isWalkthroughActive,
		showWelcome,
		forceShowWelcome,
	]);

	const handleStartWalkthrough = () => {
		hideWelcome();
		setIsWalkthroughActive(true);
	};

	const handleWalkthroughComplete = () => {
		setIsWalkthroughActive(false);
		completeOnboarding();
	};

	return (
		<>
			<WelcomeDialog
				open={showWelcomeDialog}
				onOpenChange={hideWelcome}
				onStartWalkthrough={handleStartWalkthrough}
				isReturningUser={hasCompletedOnboarding}
			/>
			<OnboardingWalkthrough
				isActive={isWalkthroughActive}
				onComplete={handleWalkthroughComplete}
			/>
		</>
	);
}
