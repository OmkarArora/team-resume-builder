import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useMemo } from "react";
import type { Resume, WorkExperience, Education, Skill } from "./types";

interface ResumeStore {
	// State
	resumes: Resume[];
	currentResume: Resume | null;
	isLoading: boolean;
	error: string | null;

	// Actions
	addResume: (resume: Omit<Resume, "id" | "createdAt" | "updatedAt">) => void;
	updateResume: (
		id: string,
		resume: Omit<Resume, "id" | "createdAt" | "updatedAt">
	) => void;
	deleteResume: (id: string) => void;
	getResume: (id: string) => Resume | undefined;
	setCurrentResume: (resume: Resume | null) => void;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string) => void;

	// Work Experience Actions
	addWorkExperience: (
		resumeId: string,
		experience: Omit<WorkExperience, "id">
	) => void;
	updateWorkExperience: (
		resumeId: string,
		experienceId: string,
		experience: Partial<WorkExperience>
	) => void;
	removeWorkExperience: (resumeId: string, experienceId: string) => void;

	// Education Actions
	addEducation: (resumeId: string, education: Omit<Education, "id">) => void;
	updateEducation: (
		resumeId: string,
		educationId: string,
		education: Partial<Education>
	) => void;
	removeEducation: (resumeId: string, educationId: string) => void;

	// Skills Actions
	addSkill: (resumeId: string, skill: Omit<Skill, "id">) => void;
	updateSkill: (
		resumeId: string,
		skillId: string,
		skill: Partial<Skill>
	) => void;
	removeSkill: (resumeId: string, skillId: string) => void;
}

// Helper function to generate unique IDs
const generateId = () => crypto.randomUUID();

// Helper function to get current timestamp
const getCurrentTimestamp = () => new Date().toISOString();

export const useResumeStore = create<ResumeStore>()(
	persist(
		(set, get) => ({
			// Initial state
			resumes: [],
			currentResume: null,
			isLoading: false,
			error: null,

			// Resume CRUD operations
			addResume: (resumeData) => {
				const newResume: Resume = {
					...resumeData,
					id: generateId(),
					createdAt: getCurrentTimestamp(),
					updatedAt: getCurrentTimestamp(),
				};

				set((state) => ({
					resumes: [...state.resumes, newResume],
					currentResume: newResume,
					error: null,
				}));
			},

			updateResume: (id, resumeData) => {
				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === id
							? {
									...resume,
									...resumeData,
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === id
							? {
									...state.currentResume,
									...resumeData,
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
					error: null,
				}));
			},

			deleteResume: (id) => {
				set((state) => ({
					resumes: state.resumes.filter((resume) => resume.id !== id),
					currentResume:
						state.currentResume?.id === id ? null : state.currentResume,
					error: null,
				}));
			},

			getResume: (id) => {
				return get().resumes.find((resume) => resume.id === id);
			},

			setCurrentResume: (resume) => {
				set({ currentResume: resume });
			},

			clearError: () => {
				set({ error: null });
			},

			setLoading: (loading) => {
				set({ isLoading: loading });
			},

			setError: (error) => {
				set({ error });
			},

			// Work Experience operations
			addWorkExperience: (resumeId, experienceData) => {
				const newExperience: WorkExperience = {
					...experienceData,
					id: generateId(),
				};

				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									workExperiences: [...resume.workExperiences, newExperience],
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									workExperiences: [
										...state.currentResume.workExperiences,
										newExperience,
									],
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			updateWorkExperience: (resumeId, experienceId, experienceData) => {
				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									workExperiences: resume.workExperiences.map((exp) =>
										exp.id === experienceId
											? { ...exp, ...experienceData }
											: exp
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									workExperiences: state.currentResume.workExperiences.map(
										(exp) =>
											exp.id === experienceId
												? { ...exp, ...experienceData }
												: exp
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			removeWorkExperience: (resumeId, experienceId) => {
				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									workExperiences: resume.workExperiences.filter(
										(exp) => exp.id !== experienceId
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									workExperiences: state.currentResume.workExperiences.filter(
										(exp) => exp.id !== experienceId
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			// Education operations
			addEducation: (resumeId, educationData) => {
				const newEducation: Education = {
					...educationData,
					id: generateId(),
				};

				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									education: [...resume.education, newEducation],
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									education: [...state.currentResume.education, newEducation],
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			updateEducation: (resumeId, educationId, educationData) => {
				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									education: resume.education.map((edu) =>
										edu.id === educationId ? { ...edu, ...educationData } : edu
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									education: state.currentResume.education.map((edu) =>
										edu.id === educationId ? { ...edu, ...educationData } : edu
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			removeEducation: (resumeId, educationId) => {
				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									education: resume.education.filter(
										(edu) => edu.id !== educationId
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									education: state.currentResume.education.filter(
										(edu) => edu.id !== educationId
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			// Skills operations
			addSkill: (resumeId, skillData) => {
				const newSkill: Skill = {
					...skillData,
					id: generateId(),
				};

				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									skills: [...resume.skills, newSkill],
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									skills: [...state.currentResume.skills, newSkill],
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			updateSkill: (resumeId, skillId, skillData) => {
				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									skills: resume.skills.map((skill) =>
										skill.id === skillId ? { ...skill, ...skillData } : skill
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									skills: state.currentResume.skills.map((skill) =>
										skill.id === skillId ? { ...skill, ...skillData } : skill
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},

			removeSkill: (resumeId, skillId) => {
				set((state) => ({
					resumes: state.resumes.map((resume) =>
						resume.id === resumeId
							? {
									...resume,
									skills: resume.skills.filter((skill) => skill.id !== skillId),
									updatedAt: getCurrentTimestamp(),
							  }
							: resume
					),
					currentResume:
						state.currentResume?.id === resumeId
							? {
									...state.currentResume,
									skills: state.currentResume.skills.filter(
										(skill) => skill.id !== skillId
									),
									updatedAt: getCurrentTimestamp(),
							  }
							: state.currentResume,
				}));
			},
		}),
		{
			name: "resume-store", // unique name for localStorage key
			storage: createJSONStorage(() => localStorage), // use localStorage
			partialize: (state) => ({
				resumes: state.resumes,
				currentResume: state.currentResume,
			}), // only persist resumes and currentResume, not loading/error states
		}
	)
);

// Selector hooks for better performance
export const useResumes = () => useResumeStore((state) => state.resumes);
export const useCurrentResume = () =>
	useResumeStore((state) => state.currentResume);
export const useResumeActions = () => {
	const addResume = useResumeStore((state) => state.addResume);
	const updateResume = useResumeStore((state) => state.updateResume);
	const deleteResume = useResumeStore((state) => state.deleteResume);
	const getResume = useResumeStore((state) => state.getResume);
	const setCurrentResume = useResumeStore((state) => state.setCurrentResume);

	return useMemo(
		() => ({
			addResume,
			updateResume,
			deleteResume,
			getResume,
			setCurrentResume,
		}),
		[addResume, updateResume, deleteResume, getResume, setCurrentResume]
	);
};

// Utility hooks for specific operations
export const useResumeById = (id: string) =>
	useResumeStore((state) => state.resumes.find((resume) => resume.id === id));

export const useResumeCount = () =>
	useResumeStore((state) => state.resumes.length);

export const useRecentResumes = (limit: number = 5) =>
	useResumeStore((state) =>
		state.resumes
			.sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
			)
			.slice(0, limit)
	);
