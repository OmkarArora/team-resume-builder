import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ResumeForm from "@/components/resume/ResumeForm";
import { useResumeById, useResumeActions } from "@/lib/store";
import { useInitializeStore } from "@/lib/hooks";
import type { Resume } from "@/lib/types";
import { toast } from "sonner";
import { useState } from "react";

export default function ResumeEdit() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

	// Initialize store with mock data if empty
	useInitializeStore();

	// Get resume from store
	const resume = useResumeById(id || "");
	const { updateResume } = useResumeActions();

	if (!resume) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Resume Not Found</h1>
					<p className="text-muted-foreground mt-2">
						The resume you're trying to edit doesn't exist.
					</p>
					<Button asChild className="mt-4">
						<Link to="/">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Back to Resumes
						</Link>
					</Button>
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

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					{/* Header */}
					<div className="flex items-center justify-between px-4 lg:px-6">
						<div className="flex items-center gap-4">
							<Button variant="outline" size="sm" asChild>
								<Link to={`/resume/${id}`}>
									<ArrowLeft className="mr-2 h-4 w-4" />
									Back to View
								</Link>
							</Button>
							<div>
								<h1 className="text-3xl font-bold tracking-tight">
									Edit Resume
								</h1>
								<p className="text-muted-foreground">
									Editing {resume.fullName}'s resume
								</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="outline" size="sm">
										<X className="mr-2 h-4 w-4" />
										Cancel
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Discard Changes?</AlertDialogTitle>
										<AlertDialogDescription>
											{hasUnsavedChanges
												? "You have unsaved changes. Are you sure you want to discard them and return to the view page?"
												: "Are you sure you want to return to the view page?"}
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Keep Editing</AlertDialogCancel>
										<AlertDialogAction onClick={handleCancelConfirm}>
											Discard Changes
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
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
