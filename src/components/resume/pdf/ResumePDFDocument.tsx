import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/lib/types";

// Use built-in fonts for better reliability
// react-pdf supports these fonts by default: Helvetica, Times-Roman, Courier
// We'll use Helvetica as it's clean and professional

// Define styles
const styles = StyleSheet.create({
	page: {
		flexDirection: "column",
		backgroundColor: "#FFFFFF",
		padding: 30,
		fontFamily: "Helvetica",
	},
	header: {
		marginBottom: 20,
		borderBottom: "2 solid #2563eb",
		paddingBottom: 15,
	},
	name: {
		fontSize: 24,
		fontWeight: 700,
		color: "#1f2937",
		marginBottom: 5,
	},
	title: {
		fontSize: 16,
		fontWeight: 500,
		color: "#6b7280",
		marginBottom: 10,
	},
	contactInfo: {
		flexDirection: "row",
		justifyContent: "space-between",
		fontSize: 10,
		color: "#6b7280",
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: 700,
		color: "#1f2937",
		marginBottom: 10,
		borderBottom: "1 solid #e5e7eb",
		paddingBottom: 5,
	},
	summary: {
		fontSize: 11,
		lineHeight: 1.5,
		color: "#374151",
		marginBottom: 15,
	},
	experienceItem: {
		marginBottom: 15,
	},
	experienceHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	jobTitle: {
		fontSize: 12,
		fontWeight: 600,
		color: "#1f2937",
	},
	company: {
		fontSize: 11,
		fontWeight: 500,
		color: "#2563eb",
	},
	dateRange: {
		fontSize: 10,
		color: "#6b7280",
	},
	description: {
		fontSize: 10,
		lineHeight: 1.4,
		color: "#374151",
		marginTop: 5,
	},
	educationItem: {
		marginBottom: 10,
	},
	degree: {
		fontSize: 12,
		fontWeight: 600,
		color: "#1f2937",
	},
	institution: {
		fontSize: 11,
		color: "#2563eb",
		marginBottom: 2,
	},
	skillsContainer: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 5,
	},
	skillTag: {
		backgroundColor: "#f3f4f6",
		padding: "3 8",
		borderRadius: 3,
		fontSize: 9,
		color: "#374151",
		marginBottom: 3,
	},
	twoColumn: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	leftColumn: {
		width: "48%",
	},
	rightColumn: {
		width: "48%",
	},
});

interface ResumePDFDocumentProps {
	resume: Resume;
}

const ResumePDFDocument: React.FC<ResumePDFDocumentProps> = ({ resume }) => {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
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

	return (
		<Document>
			<Page size="A4" style={styles.page}>
				{/* Header Section */}
				<View style={styles.header}>
					<Text style={styles.name}>{resume.fullName}</Text>
					<Text style={styles.title}>{resume.title}</Text>
					<View style={styles.contactInfo}>
						<Text>{resume.email}</Text>
						{resume.phone && <Text>{resume.phone}</Text>}
						{resume.location && <Text>{resume.location}</Text>}
					</View>
				</View>

				{/* Summary Section */}
				{resume.summary && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Professional Summary</Text>
						<Text style={styles.summary}>{resume.summary}</Text>
					</View>
				)}

				{/* Two Column Layout for Experience and Education */}
				<View style={styles.twoColumn}>
					{/* Left Column - Work Experience */}
					<View style={styles.leftColumn}>
						{resume.workExperiences.length > 0 && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Work Experience</Text>
								{resume.workExperiences.map((experience, index) => (
									<View key={index} style={styles.experienceItem}>
										<View style={styles.experienceHeader}>
											<View>
												<Text style={styles.jobTitle}>
													{experience.position}
												</Text>
												<Text style={styles.company}>{experience.company}</Text>
											</View>
											<Text style={styles.dateRange}>
												{formatDateRange(
													experience.startDate,
													experience.endDate,
													experience.isCurrent
												)}
											</Text>
										</View>
										{experience.description && (
											<Text style={styles.description}>
												{experience.description}
											</Text>
										)}
									</View>
								))}
							</View>
						)}
					</View>

					{/* Right Column - Education and Skills */}
					<View style={styles.rightColumn}>
						{/* Education Section */}
						{resume.education.length > 0 && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Education</Text>
								{resume.education.map((edu, index) => (
									<View key={index} style={styles.educationItem}>
										<Text style={styles.degree}>{edu.degree}</Text>
										<Text style={styles.institution}>{edu.institution}</Text>
										<Text style={styles.dateRange}>
											{formatDateRange(edu.startDate, edu.endDate, false)}
										</Text>
									</View>
								))}
							</View>
						)}

						{/* Skills Section */}
						{resume.skills.length > 0 && (
							<View style={styles.section}>
								<Text style={styles.sectionTitle}>Skills</Text>
								<View style={styles.skillsContainer}>
									{resume.skills.map((skill, index) => (
										<Text key={index} style={styles.skillTag}>
											{skill.skillName} ({skill.proficiencyLevel})
										</Text>
									))}
								</View>
							</View>
						)}
					</View>
				</View>
			</Page>
		</Document>
	);
};

export default ResumePDFDocument;
