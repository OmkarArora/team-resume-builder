import { Link } from "react-router";
import { Plus, Edit, Eye, Calendar, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SearchBar } from "@/components/ui/search-bar";
import { useResumes, useResumeStore } from "@/lib/store";
import type { Resume } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { useMemo, useState } from "react";

export default function ResumeList() {
	const resumes = useResumes();
	const deleteResume = useResumeStore((state) => state.deleteResume);
	const [query, setQuery] = useState("");
	const [resumeToDelete, setResumeToDelete] = useState<Resume | null>(null);

	const filteredResumes = useMemo(() => {
		if (!query.trim()) return resumes;
		const q = query.toLowerCase();
		return resumes.filter((r) => {
			const inName = r.fullName.toLowerCase().includes(q);
			const inTitle = (r.title ?? "").toLowerCase().includes(q);
			const inSummary = (r.summary ?? "").toLowerCase().includes(q);
			const inSkills = r.skills.some((s) =>
				s.skillName.toLowerCase().includes(q)
			);
			return inName || inTitle || inSummary || inSkills;
		});
	}, [resumes, query]);

	const handleDeleteClick = (resume: Resume) => {
		setResumeToDelete(resume);
	};

	const handleDeleteConfirm = () => {
		if (resumeToDelete) {
			deleteResume(resumeToDelete.id);
			setResumeToDelete(null);
		}
	};

	const handleDeleteCancel = () => {
		setResumeToDelete(null);
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					{/* Header */}
					<div className="flex items-center justify-between gap-4 px-4 lg:px-6 flex-wrap">
						<div className="flex items-center gap-3">
							<FileText className="h-6 w-6" />
							<p className="text-foreground">
								Manage and view all your resumes
							</p>
						</div>
						<div className="flex items-center gap-2">
							<SearchBar
								value={query}
								onChange={setQuery}
								placeholder="Search resumes..."
								ariaLabel="Search resumes"
							/>
							<Button asChild>
								<Link to="/resume/new">
									<div className="flex items-center gap-2">
										<Plus className="h-4 w-4" />
										Create Resume
									</div>
								</Link>
							</Button>
						</div>
					</div>

					{/* Resume Grid */}
					<div className="px-4 lg:px-6">
						{resumes.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="rounded-full bg-muted p-6">
									<Plus className="h-8 w-8 text-muted-foreground" />
								</div>
								<h3 className="mt-4 text-lg font-semibold">No resumes yet</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Get started by creating your first resume
								</p>
								<Button asChild className="mt-4">
									<Link to="/resume/new">
										<div className="flex items-center gap-2">
											<Plus className="h-4 w-4" />
											Create Resume
										</div>
									</Link>
								</Button>
							</div>
						) : filteredResumes.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="rounded-full bg-muted p-6">
									<FileText className="h-8 w-8 text-muted-foreground" />
								</div>
								<h3 className="mt-4 text-lg font-semibold">No matches found</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Try a different search term
								</p>
							</div>
						) : (
							<div className="flex gap-4 flex-wrap">
								{filteredResumes.map((resume) => (
									<ResumeCard
										key={resume.id}
										resume={resume}
										onDeleteClick={handleDeleteClick}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Confirmation Dialog */}
			<ConfirmationDialog
				open={resumeToDelete !== null}
				onOpenChange={(open) => !open && handleDeleteCancel()}
				title="Delete Resume"
				description={
					resumeToDelete
						? `Are you sure you want to delete ${resumeToDelete.fullName}'s resume? This action cannot be undone.`
						: ""
				}
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleDeleteConfirm}
				variant="default"
			/>
		</div>
	);
}

function ResumeCard({
	resume,
	onDeleteClick,
}: {
	resume: Resume;
	onDeleteClick: (resume: Resume) => void;
}) {
	return (
		<Card
			key={resume.id}
			className="hover:shadow-md transition-shadow w-full md:w-[300px] aspect-[0.7] py-4 px-6"
		>
			<CardHeader className="pb-3 px-0">
				<div className="flex flex-col gap-1">
					<div className="flex justify-between items-center gap-1">
						<CardTitle className="text-lg">{resume.fullName}</CardTitle>
						<Badge variant="outline" className="text-xs">
							{resume.workExperiences.length} experience
							{resume.workExperiences.length !== 1 ? "s" : ""}
						</Badge>
					</div>
					<p className="text-sm text-muted-foreground">{resume.title}</p>
				</div>
			</CardHeader>
			<CardContent className="pt-0 flex-1 flex flex-col gap-3 px-0">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Calendar className="h-4 w-4" />
					<span>Updated {formatDate(resume.updatedAt)}</span>
				</div>
				{resume.summary && (
					<p className="text-sm md:line-clamp-5">{resume.summary}</p>
				)}
				<div className="flex flex-wrap gap-1">
					{resume.skills.slice(0, 3).map((skill) => (
						<Badge key={skill.id} variant="secondary" className="text-xs">
							{skill.skillName}
						</Badge>
					))}
					{resume.skills.length > 3 && (
						<Badge variant="secondary" className="text-xs">
							+{resume.skills.length - 3} more
						</Badge>
					)}
				</div>
			</CardContent>
			<CardFooter className="flex items-center gap-2 p-0">
				<Button variant="outline" size="sm" asChild className="flex-1">
					<Link to={`/resume/${resume.id}`}>
						<div className="flex items-center gap-2">
							<Eye className="h-4 w-4" />
							View
						</div>
					</Link>
				</Button>
				<Button variant="outline" size="sm" asChild className="flex-1">
					<Link to={`/resume/${resume.id}/edit`}>
						<div className="flex items-center gap-2">
							<Edit className="h-4 w-4" />
							Edit
						</div>
					</Link>
				</Button>
				<Button
					variant="destructive"
					size="sm"
					className="px-3"
					onClick={() => onDeleteClick(resume)}
					title="Delete resume"
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
}
