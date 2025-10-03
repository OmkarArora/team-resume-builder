import { useParams, Link } from "react-router";
import {
	ArrowLeft,
	Edit,
	Download,
	Mail,
	Phone,
	MapPin,
	ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useResumeById } from "@/lib/store";
import BackButton from "@/components/ui/back-button";

export default function ResumeView() {
	const { id } = useParams<{ id: string }>();

	// Get resume from store
	const resume = useResumeById(id || "");

	if (!resume) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Resume Not Found</h1>
					<p className="text-muted-foreground mt-2">
						The resume you're looking for doesn't exist.
					</p>
					<Button asChild className="mt-4">
						<Link to="/">
							<div className="flex items-center gap-2">
								<ArrowLeft className="h-4 w-4" />
								Back to Resumes
							</div>
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
		});
	};

	const formatDateRange = (
		startDate: string,
		endDate: string | null,
		isCurrent: boolean
	) => {
		const start = formatDate(startDate);
		const end = isCurrent
			? "Present"
			: endDate
			? formatDate(endDate)
			: "Present";
		return `${start} - ${end}`;
	};

	const getProficiencyColor = (level: string) => {
		switch (level) {
			case "Expert":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "Advanced":
				return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
			case "Intermediate":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "Beginner":
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					{/* Header */}
					<div className="flex items-center justify-between px-4 lg:px-6">
						<div className="flex items-center gap-4">
							<BackButton />
							<div className="flex items-baseline flex-wrap gap-2">
								<h1 className="text-3xl font-bold tracking-tight">
									{resume.fullName}
								</h1>
								<p className="text-muted-foreground">{resume.title}</p>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" asChild>
								<Link to={`/resume/${resume.id}/edit`}>
									<div className="flex items-center gap-2">
										<Edit className="h-4 w-4" />
										Edit
									</div>
								</Link>
							</Button>
							<Button variant="outline" size="sm">
								<div className="flex items-center gap-2">
									<Download className="h-4 w-4" />
									Download
								</div>
							</Button>
						</div>
					</div>

					{/* Resume Content */}
					<div className="px-4 lg:px-6">
						<div className="max-w-4xl mx-auto">
							<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
								{/* Left Column - Contact & Skills */}
								<div className="lg:col-span-1 space-y-6">
									{/* Contact Information */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">
												Contact Information
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											<div className="flex items-center gap-3">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<a
													href={`mailto:${resume.email}`}
													className="text-sm hover:underline"
												>
													{resume.email}
												</a>
											</div>
											{resume.phone && (
												<div className="flex items-center gap-3">
													<Phone className="h-4 w-4 text-muted-foreground" />
													<a
														href={`tel:${resume.phone}`}
														className="text-sm hover:underline"
													>
														{resume.phone}
													</a>
												</div>
											)}
											{resume.location && (
												<div className="flex items-center gap-3">
													<MapPin className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">{resume.location}</span>
												</div>
											)}
											{resume.linkedinUrl && (
												<div className="flex items-center gap-3">
													<ExternalLink className="h-4 w-4 text-muted-foreground" />
													<a
														href={resume.linkedinUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm hover:underline"
													>
														LinkedIn Profile
													</a>
												</div>
											)}
											{resume.portfolioUrl && (
												<div className="flex items-center gap-3">
													<ExternalLink className="h-4 w-4 text-muted-foreground" />
													<a
														href={resume.portfolioUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="text-sm hover:underline"
													>
														Portfolio Website
													</a>
												</div>
											)}
										</CardContent>
									</Card>

									{/* Skills */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Skills</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="space-y-3">
												{Object.entries(
													resume.skills.reduce((acc, skill) => {
														if (!acc[skill.category]) {
															acc[skill.category] = [];
														}
														acc[skill.category].push(skill);
														return acc;
													}, {} as Record<string, typeof resume.skills>)
												).map(([category, skills]) => (
													<div key={category}>
														<h4 className="font-medium text-sm mb-2">
															{category}
														</h4>
														<div className="space-y-1">
															{skills.map((skill) => (
																<div
																	key={skill.id}
																	className="flex items-center justify-between"
																>
																	<span className="text-sm">
																		{skill.skillName}
																	</span>
																	<Badge
																		variant="secondary"
																		className={`text-xs ${getProficiencyColor(
																			skill.proficiencyLevel
																		)}`}
																	>
																		{skill.proficiencyLevel}
																	</Badge>
																</div>
															))}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Right Column - Main Content */}
								<div className="lg:col-span-2 space-y-6">
									{/* Professional Summary */}
									{resume.summary && (
										<Card>
											<CardHeader>
												<CardTitle className="text-lg">
													Professional Summary
												</CardTitle>
											</CardHeader>
											<CardContent>
												<p className="text-sm leading-relaxed">
													{resume.summary}
												</p>
											</CardContent>
										</Card>
									)}

									{/* Work Experience */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Work Experience</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											{resume.workExperiences.map((exp, index) => (
												<div key={exp.id}>
													<div className="space-y-2">
														<div className="flex items-start justify-between">
															<div>
																<h4 className="font-semibold">
																	{exp.position}
																</h4>
																<p className="text-sm font-medium text-muted-foreground">
																	{exp.company}
																</p>
																<p className="text-xs text-muted-foreground">
																	{formatDateRange(
																		exp.startDate,
																		exp.endDate,
																		exp.isCurrent
																	)}
																	{exp.location && ` • ${exp.location}`}
																</p>
															</div>
														</div>
														{exp.description && (
															<p className="text-sm leading-relaxed">
																{exp.description}
															</p>
														)}
													</div>
													{index < resume.workExperiences.length - 1 && (
														<Separator className="mt-4" />
													)}
												</div>
											))}
										</CardContent>
									</Card>

									{/* Education */}
									<Card>
										<CardHeader>
											<CardTitle className="text-lg">Education</CardTitle>
										</CardHeader>
										<CardContent className="space-y-4">
											{resume.education.map((edu, index) => (
												<div key={edu.id}>
													<div className="space-y-2">
														<div className="flex items-start justify-between">
															<div>
																<h4 className="font-semibold">{edu.degree}</h4>
																<p className="text-sm font-medium text-muted-foreground">
																	{edu.institution}
																</p>
																<p className="text-xs text-muted-foreground">
																	{formatDateRange(
																		edu.startDate,
																		edu.endDate,
																		false
																	)}
																	{edu.gpa && ` • GPA: ${edu.gpa}`}
																</p>
															</div>
														</div>
														{edu.description && (
															<p className="text-sm leading-relaxed">
																{edu.description}
															</p>
														)}
													</div>
													{index < resume.education.length - 1 && (
														<Separator className="mt-4" />
													)}
												</div>
											))}
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
