import { useParams, Link } from "react-router";
import { useState } from "react";
import {
	ArrowLeft,
	Edit,
	Download,
	Mail,
	Phone,
	MapPin,
	ExternalLink,
	Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useResumeById } from "@/lib/store";
import { useReactPDFExport } from "@/lib/hooks";
import { toast } from "sonner";
import BackButton from "@/components/ui/back-button";

export default function ResumeView() {
	const { id } = useParams<{ id: string }>();

	// Get resume from store
	const resume = useResumeById(id || "");

	// PDF functionality state
	const [isExporting, setIsExporting] = useState(false);
	const [isPreviewing, setIsPreviewing] = useState(false);
	const { exportToPDF } = useReactPDFExport();

	const handlePDFExport = async () => {
		if (!resume) return;

		setIsExporting(true);
		try {
			await exportToPDF(resume);
			toast.success("PDF downloaded successfully!");
		} catch (error) {
			toast.error("Failed to generate PDF");
			console.error("PDF export error:", error);
		} finally {
			setIsExporting(false);
		}
	};

	const handlePDFPreview = async () => {
		if (!resume) return;

		setIsPreviewing(true);
		try {
			// Generate PDF blob
			const { pdf } = await import("@react-pdf/renderer");
			const { default: ResumePDFDocument } = await import(
				"@/components/resume/pdf/ResumePDFDocument"
			);

			const blob = await pdf(<ResumePDFDocument resume={resume} />).toBlob();
			const url = URL.createObjectURL(blob);

			// Open in new tab
			const newTab = window.open(url, "_blank");
			if (!newTab) {
				toast.error("Please allow popups to preview PDF");
			} else {
				toast.success("PDF preview opened in new tab");
			}

			// Clean up the URL after a delay to allow the tab to load
			setTimeout(() => {
				URL.revokeObjectURL(url);
			}, 10000);
		} catch (error) {
			toast.error("Failed to generate PDF preview");
			console.error("PDF preview error:", error);
		} finally {
			setIsPreviewing(false);
		}
	};

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
					<div className="flex items-center justify-between px-4 lg:px-6 flex-wrap gap-2">
						<div className="flex items-center gap-4">
							<BackButton />
							<div className="flex items-baseline flex-wrap gap-1">
								<h1 className="text-3xl font-bold tracking-tight">
									{resume.fullName}
								</h1>
								<p className="text-muted-foreground">{resume.title}</p>
							</div>
						</div>
						<div className="flex items-center gap-2 flex-wrap  ">
							<Button variant="outline" size="sm" asChild>
								<Link to={`/resume/${resume.id}/edit`}>
									<div className="flex items-center gap-2">
										<Edit className="h-4 w-4" />
										Edit
									</div>
								</Link>
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={handlePDFPreview}
								disabled={isPreviewing}
							>
								<div className="flex items-center gap-2">
									<Eye className="h-4 w-4" />
									{isPreviewing ? "Opening..." : "Preview PDF"}
								</div>
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={handlePDFExport}
								disabled={isExporting}
							>
								<div className="flex items-center gap-2">
									<Download className="h-4 w-4" />
									{isExporting ? "Generating..." : "Download PDF"}
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
									{resume.skills.length > 0 && (
										<Card>
											<CardHeader>
												<CardTitle className="text-lg">Skills</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="flex flex-wrap gap-2">
													{resume.skills.map((skill) => (
														<Badge
															key={skill.id}
															variant="secondary"
															className={getProficiencyColor(
																skill.proficiencyLevel
															)}
														>
															{skill.skillName}
														</Badge>
													))}
												</div>
											</CardContent>
										</Card>
									)}
								</div>

								{/* Right Column - Summary, Experience, Education */}
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
									{resume.workExperiences.length > 0 && (
										<Card>
											<CardHeader>
												<CardTitle className="text-lg">
													Work Experience
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-4">
												{resume.workExperiences.map((experience, index) => (
													<div key={experience.id}>
														<div className="space-y-2">
															<div className="flex items-start justify-between">
																<div>
																	<h3 className="font-semibold text-base">
																		{experience.position}
																	</h3>
																	<p className="text-sm text-blue-600 font-medium">
																		{experience.company}
																	</p>
																</div>
																<div className="text-right text-sm text-muted-foreground">
																	<p>
																		{formatDateRange(
																			experience.startDate,
																			experience.endDate,
																			experience.isCurrent
																		)}
																	</p>
																	{experience.location && (
																		<p className="text-xs">
																			{experience.location}
																		</p>
																	)}
																</div>
															</div>
															{experience.description && (
																<p className="text-sm text-muted-foreground leading-relaxed">
																	{experience.description}
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
									)}

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
																<h3 className="font-semibold text-base">
																	{edu.degree}
																</h3>
																<p className="text-sm text-blue-600 font-medium">
																	{edu.institution}
																</p>
															</div>
															<div className="text-right text-sm text-muted-foreground">
																<p>
																	{formatDateRange(
																		edu.startDate,
																		edu.endDate,
																		false
																	)}
																</p>
																{edu.gpa && (
																	<p className="text-xs">GPA: {edu.gpa}</p>
																)}
															</div>
														</div>
														{edu.description && (
															<p className="text-sm text-muted-foreground leading-relaxed">
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
