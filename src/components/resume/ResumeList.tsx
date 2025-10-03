import { Link } from "react-router";
import { Plus, Edit, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useResumes } from "@/lib/store";
import { useInitializeStore } from "@/lib/hooks";

export default function ResumeList() {
	const resumes = useResumes();

	// Initialize store with mock data if empty
	useInitializeStore();

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					{/* Header */}
					<div className="flex items-center justify-between px-4 lg:px-6">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
							<p className="text-muted-foreground">
								Manage and view all your resumes
							</p>
						</div>
						<Button asChild>
							<Link to="/resume/new">
								<Plus className="mr-2 h-4 w-4" />
								Create Resume
							</Link>
						</Button>
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
										<Plus className="mr-2 h-4 w-4" />
										Create Resume
									</Link>
								</Button>
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
								{resumes.map((resume) => (
									<Card
										key={resume.id}
										className="hover:shadow-md transition-shadow"
									>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between">
												<div className="space-y-1">
													<CardTitle className="text-lg">
														{resume.fullName}
													</CardTitle>
													<p className="text-sm text-muted-foreground">
														{resume.title}
													</p>
												</div>
												<Badge variant="outline" className="text-xs">
													{resume.workExperiences.length} experience
													{resume.workExperiences.length !== 1 ? "s" : ""}
												</Badge>
											</div>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="space-y-3">
												<div className="flex items-center gap-2 text-sm text-muted-foreground">
													<Calendar className="h-4 w-4" />
													<span>Updated {formatDate(resume.updatedAt)}</span>
												</div>
												{resume.summary && (
													<p className="text-sm line-clamp-2">
														{resume.summary}
													</p>
												)}
												<div className="flex flex-wrap gap-1">
													{resume.skills.slice(0, 3).map((skill) => (
														<Badge
															key={skill.id}
															variant="secondary"
															className="text-xs"
														>
															{skill.skillName}
														</Badge>
													))}
													{resume.skills.length > 3 && (
														<Badge variant="secondary" className="text-xs">
															+{resume.skills.length - 3} more
														</Badge>
													)}
												</div>
											</div>
										</CardContent>
										<div className="flex items-center gap-2 p-4 pt-0">
											<Button
												variant="outline"
												size="sm"
												asChild
												className="flex-1"
											>
												<Link to={`/resume/${resume.id}`}>
													<Eye className="mr-2 h-4 w-4" />
													View
												</Link>
											</Button>
											<Button
												variant="outline"
												size="sm"
												asChild
												className="flex-1"
											>
												<Link to={`/resume/${resume.id}/edit`}>
													<Edit className="mr-2 h-4 w-4" />
													Edit
												</Link>
											</Button>
										</div>
									</Card>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
