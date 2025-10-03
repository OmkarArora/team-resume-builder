import { useResumeStore, useTeamStore } from "./store";
import type { Resume, TeamMember } from "./types";

// Constants for localStorage keys
const INITIALIZATION_FLAG_KEY = "trb-store-initialized";
const TEAM_INITIALIZATION_FLAG_KEY = "trb-team-initialized";

// Helper functions for localStorage management
const isStoreInitialized = (): boolean => {
	return localStorage.getItem(INITIALIZATION_FLAG_KEY) === "true";
};

const setStoreInitialized = (): void => {
	localStorage.setItem(INITIALIZATION_FLAG_KEY, "true");
};

const isTeamInitialized = (): boolean => {
	return localStorage.getItem(TEAM_INITIALIZATION_FLAG_KEY) === "true";
};

const setTeamInitialized = (): void => {
	localStorage.setItem(TEAM_INITIALIZATION_FLAG_KEY, "true");
};

const resetInitializationFlags = (): void => {
	localStorage.removeItem(INITIALIZATION_FLAG_KEY);
	localStorage.removeItem(TEAM_INITIALIZATION_FLAG_KEY);
};

/**
 * Utility function to manually reset initialization flags
 * Useful for development/testing when you want to force re-initialization
 */
export const resetStoreInitialization = (): void => {
	resetInitializationFlags();
	console.log(
		"Store initialization flags reset. Store will be re-initialized on next app start."
	);
};

// Mock data for development/testing
const mockResumes: Resume[] = [
	{
		id: "1",
		fullName: "John Doe",
		email: "john.doe@example.com",
		phone: "+1 (555) 123-4567",
		title: "Senior Software Engineer",
		summary:
			"Experienced software engineer with 5+ years of experience in full-stack development. Passionate about creating scalable and maintainable applications using modern technologies. Led multiple successful projects from conception to deployment.",
		location: "San Francisco, CA",
		linkedinUrl: "https://linkedin.com/in/johndoe",
		portfolioUrl: "https://johndoe.dev",
		workExperiences: [
			{
				id: "exp1",
				company: "Tech Corp",
				position: "Senior Software Engineer",
				startDate: "2022-01-01",
				endDate: null,
				description:
					"Led development of microservices architecture serving 1M+ users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews.",
				location: "San Francisco, CA",
				isCurrent: true,
			},
			{
				id: "exp2",
				company: "StartupXYZ",
				position: "Software Engineer",
				startDate: "2020-06-01",
				endDate: "2021-12-31",
				description:
					"Developed React-based web applications and Node.js backend services. Collaborated with cross-functional teams to deliver features on time.",
				location: "Remote",
				isCurrent: false,
			},
		],
		education: [
			{
				id: "edu1",
				institution: "Stanford University",
				degree: "Bachelor of Science in Computer Science",
				startDate: "2016-09-01",
				endDate: "2020-06-01",
				gpa: "3.8",
				description:
					"Graduated Magna Cum Laude. Relevant coursework: Data Structures, Algorithms, Software Engineering, Database Systems.",
			},
		],
		skills: [
			{
				id: "skill1",
				skillName: "React",
				category: "Frontend",
				proficiencyLevel: "Expert",
			},
			{
				id: "skill2",
				skillName: "Node.js",
				category: "Backend",
				proficiencyLevel: "Advanced",
			},
			{
				id: "skill3",
				skillName: "TypeScript",
				category: "Programming",
				proficiencyLevel: "Expert",
			},
			{
				id: "skill4",
				skillName: "AWS",
				category: "Cloud",
				proficiencyLevel: "Intermediate",
			},
			{
				id: "skill5",
				skillName: "Docker",
				category: "DevOps",
				proficiencyLevel: "Advanced",
			},
		],
		createdAt: "2024-01-15T10:00:00Z",
		updatedAt: "2024-01-20T15:30:00Z",
	},
	{
		id: "2",
		fullName: "Jane Smith",
		email: "jane.smith@example.com",
		phone: "+1 (555) 987-6543",
		title: "Product Manager",
		summary:
			"Strategic product manager with expertise in user experience and data-driven decision making. Led product initiatives that increased user engagement by 40% and revenue by 25%.",
		location: "New York, NY",
		linkedinUrl: "https://linkedin.com/in/janesmith",
		portfolioUrl: "https://janesmith.co",
		workExperiences: [
			{
				id: "exp3",
				company: "StartupXYZ",
				position: "Product Manager",
				startDate: "2021-03-01",
				endDate: null,
				description:
					"Managed product roadmap and user research initiatives. Led cross-functional teams of 8+ members to deliver features that improved user satisfaction scores by 30%.",
				location: "New York, NY",
				isCurrent: true,
			},
		],
		education: [
			{
				id: "edu2",
				institution: "Harvard Business School",
				degree: "Master of Business Administration",
				startDate: "2019-09-01",
				endDate: "2021-05-01",
				gpa: "3.9",
				description:
					"Focus on Technology and Innovation. Completed coursework in Product Management, Data Analytics, and Strategic Planning.",
			},
		],
		skills: [
			{
				id: "skill6",
				skillName: "Product Strategy",
				category: "Management",
				proficiencyLevel: "Expert",
			},
			{
				id: "skill7",
				skillName: "User Research",
				category: "Research",
				proficiencyLevel: "Advanced",
			},
			{
				id: "skill8",
				skillName: "Data Analysis",
				category: "Analytics",
				proficiencyLevel: "Advanced",
			},
		],
		createdAt: "2024-01-10T09:00:00Z",
		updatedAt: "2024-01-18T12:00:00Z",
	},
];

/**
 * Function to initialize the store with mock data for development
 * Only runs if the store is empty and not already initialized (tracked in localStorage)
 */
export const initializeStore = () => {
	const resumeStore = useResumeStore.getState();

	// Only initialize if store is empty and not already initialized
	if (resumeStore.resumes.length === 0 && !isStoreInitialized()) {
		console.log("Initializing store with mock data...");
		setStoreInitialized();
		mockResumes.forEach((resume) => {
			resumeStore.addResume(resume);
		});
		console.log("Store initialization complete");
	}

	// Initialize team members linked to existing mock resumes (once)
	// Get fresh state after potential resume additions
	const currentResumeStore = useResumeStore.getState();
	const currentTeamStore = useTeamStore.getState();

	if (
		!isTeamInitialized() &&
		currentTeamStore.teamMembers.length === 0 &&
		currentResumeStore.resumes.length > 0
	) {
		setTeamInitialized();
		console.log("Initializing team members...");
		// Seed team members based on existing resumes so linkage reflects initial data
		const mockTeam: Omit<TeamMember, "id" | "createdAt" | "updatedAt">[] =
			currentResumeStore.resumes.slice(0, 5).map((r) => ({
				fullName: r.fullName,
				role: r.title,
				email: r.email,
				avatarUrl: undefined,
				resumeIds: [r.id],
			}));

		mockTeam.forEach((m) => currentTeamStore.addMember(m));
		console.log("Team initialization complete");
	}
};

/**
 * Hook to clear all data from the store (useful for testing)
 */
export const useClearStore = () => {
	const { resumes, deleteResume } = useResumeStore();

	const clearAllResumes = () => {
		resumes.forEach((resume) => {
			deleteResume(resume.id);
		});
		// Reset initialization flags when clearing
		resetInitializationFlags();
	};

	return { clearAllResumes };
};

/**
 * Hook to export store data as JSON (useful for backup/export)
 */
export const useExportStore = () => {
	const { resumes } = useResumeStore();

	const exportData = () => {
		const data = {
			resumes,
			exportedAt: new Date().toISOString(),
			version: "1.0.0",
		};

		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `resumes-backup-${
			new Date().toISOString().split("T")[0]
		}.json`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	return { exportData };
};

/**
 * Hook to import store data from JSON (useful for restore/import)
 */
export const useImportStore = () => {
	const { addResume } = useResumeStore();

	const importData = (file: File): Promise<void> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const data = JSON.parse(e.target?.result as string);

					if (data.resumes && Array.isArray(data.resumes)) {
						data.resumes.forEach((resume: Resume) => {
							addResume(resume);
						});
						resolve();
					} else {
						reject(new Error("Invalid file format"));
					}
				} catch (error) {
					reject(error);
				}
			};

			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.readAsText(file);
		});
	};

	return { importData };
};
