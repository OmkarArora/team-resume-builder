import { useCallback, useEffect, useState } from "react";
import Joyride, { STATUS, type Step, type CallBackProps } from "react-joyride";

interface OnboardingWalkthroughProps {
	isActive: boolean;
	onComplete: () => void;
}

export function OnboardingWalkthrough({
	isActive,
	onComplete,
}: OnboardingWalkthroughProps) {
	const [run, setRun] = useState(false);

	useEffect(() => {
		if (isActive) {
			// Add a small delay to ensure DOM elements are ready
			const timer = setTimeout(() => {
				setRun(true);
			}, 500);
			return () => clearTimeout(timer);
		} else {
			setRun(false);
		}
	}, [isActive]);

	const handleJoyrideCallback = useCallback(
		(data: CallBackProps) => {
			const { status } = data;
			// console.log("Joyride callback:", { status, type, action, index });

			if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
				// console.log("Walkthrough completed");
				setRun(false);
				onComplete();
			}
		},
		[onComplete]
	);

	const steps: Step[] = [
		{
			target: "[data-tour='sidebar']",
			content: (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold">Navigation Sidebar</h3>
					<p className="text-sm text-muted-foreground">
						Use the sidebar to navigate between Dashboard and Team sections. The
						Dashboard is where you'll manage all your resumes.
					</p>
				</div>
			),
			placement: "right",
			disableBeacon: true,
		},
		{
			target: "[data-tour='dashboard-header']",
			content: (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold">Dashboard Overview</h3>
					<p className="text-sm text-muted-foreground">
						This is your main dashboard where you can view and manage all your
						resumes. You can search, create new resumes, and organize your work
						here.
					</p>
				</div>
			),
			placement: "bottom",
		},
		{
			target: "[data-tour='create-resume-btn']",
			content: (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold">Create Resume</h3>
					<p className="text-sm text-muted-foreground">
						Click this button to create a new resume. You'll be guided through
						the process of adding personal information, work experience, skills,
						and more.
					</p>
				</div>
			),
			placement: "bottom",
		},
		{
			target: "body",
			content: (
				<div className="space-y-3">
					<h3 className="text-lg font-semibold">You're All Set!</h3>
					<p className="text-sm text-muted-foreground">
						Great! You've learned about the dashboard. You can now create
						resumes, manage your work, and explore the Team section to
						collaborate with others.
					</p>
				</div>
			),
			placement: "center",
		},
	];

	return (
		<Joyride
			steps={steps}
			run={run}
			callback={handleJoyrideCallback}
			continuous
			showProgress
			showSkipButton
			disableOverlayClose
			disableCloseOnEsc
			disableScrolling={false}
			scrollOffset={100}
			spotlightPadding={4}
			spotlightClicks={false}
			styles={{
				options: {
					primaryColor: "var(--primary)",
					textColor: "var(--foreground)",
					backgroundColor: "var(--card)",
					overlayColor: "rgba(0, 0, 0, 0.6)",
					spotlightShadow: "0 0 20px rgba(0, 0, 0, 0.8)",
					beaconSize: 36,
					zIndex: 9999,
					arrowColor: "var(--card)",
				},
				tooltip: {
					borderRadius: 8,
					padding: 20,
				},
				tooltipContainer: {
					textAlign: "left",
				},
				tooltipTitle: {
					fontSize: 18,
					fontWeight: 600,
				},
				tooltipContent: {
					fontSize: 14,
					paddingBottom: 16,
				},
				buttonNext: {
					backgroundColor: "var(--primary)",
					borderRadius: 6,
					color: "var(--primary-foreground)",
					fontSize: 14,
					fontWeight: 500,
					padding: "8px 16px",
				},
				buttonBack: {
					color: "var(--muted-foreground)",
					marginRight: 10,
					fontSize: 14,
				},
				buttonSkip: {
					color: "var(--muted-foreground)",
					fontSize: 14,
				},
			}}
			locale={{
				back: "Back",
				close: "Close",
				last: "Finish",
				next: "Next",
				skip: "Skip",
			}}
		/>
	);
}
