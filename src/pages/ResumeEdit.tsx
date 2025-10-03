import { useParams, useNavigate } from "react-router";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import ResumeForm from "@/components/resume/ResumeForm";
import { useResumeById, useResumeStore } from "@/lib/store";
import type { Resume } from "@/lib/types";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import BackButton from "@/components/ui/back-button";

export default function ResumeEdit() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Get resume from store
	const resume = useResumeById(id || "");
	const updateResume = useResumeStore((state) => state.updateResume);

	if (!resume) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Resume Not Found</h1>
					<p className="text-muted-foreground mt-2">
						The resume you're trying to edit doesn't exist.
					</p>
					<BackButton />
				</div>
			</div>
		);
	}

	const handleSave = (
		updatedResume: Omit<Resume, "id" | "createdAt" | "updatedAt">
	) => {
		if (!id) return;

		// Update resume in store
		updateResume(id, updatedResume);

		// Reset unsaved changes flag
		setHasUnsavedChanges(false);

		// Show success message
		toast.success("Resume saved successfully!");

		// Redirect to view page
		navigate(`/resume/${id}`);
	};

	const handleFormChange = () => {
		setHasUnsavedChanges(true);
	};

	const handleCancelConfirm = () => {
		navigate(`/resume/${id}`);
	};

	// Handle browser close/refresh with unsaved changes
	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				event.preventDefault();
				// Modern browsers ignore custom messages, but we still need to set returnValue
				event.returnValue = "";
				return "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [hasUnsavedChanges]);

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					{/* Header */}
					<div className="flex items-center justify-between px-4 lg:px-6">
						<div className="flex items-center gap-4">
							<BackButton />
							<div>
								<h1 className="text-3xl font-bold tracking-tight">
									Editing {resume.fullName}'s resume
								</h1>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<ConfirmationDialog
								trigger={
									<Button variant="outline" size="sm">
										<X className="mr-2 h-4 w-4" />
										Cancel
									</Button>
								}
								title="Discard Changes?"
								description={
									hasUnsavedChanges
										? "You have unsaved changes. Are you sure you want to discard them and return to the view page?"
										: "Are you sure you want to return to the view page?"
								}
								confirmText="Discard Changes"
								cancelText="Keep Editing"
								onConfirm={handleCancelConfirm}
								variant="default"
							/>
							<Button
								size="sm"
								onClick={() => {
									// Trigger form submission
									const form = document.querySelector("form");
									if (form) {
										form.requestSubmit();
									}
								}}
							>
								<Save className="mr-2 h-4 w-4" />
								Save Changes
							</Button>
						</div>
					</div>

					{/* Resume Form */}
					<div className="px-4 lg:px-6">
						<div className="max-w-4xl mx-auto">
							<ResumeForm
								resume={resume}
								onSave={handleSave}
								// onCancel={handleCancelConfirm}
								onChange={handleFormChange}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
