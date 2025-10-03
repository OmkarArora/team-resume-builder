import { useReducer, useCallback, useMemo } from "react";
import {
	type Resume,
	type WorkExperience,
	type Education,
	type Skill,
} from "@/lib/types";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

interface ResumeFormProps {
	resume?: Resume;
	onSave: (resume: Omit<Resume, "id" | "createdAt" | "updatedAt">) => void;
	onChange?: () => void;
}

type FormState = Omit<Resume, "id" | "createdAt" | "updatedAt">;

type FormAction =
	| { type: "SET_FIELD"; field: keyof FormState; value: any }
	| { type: "ADD_WORK_EXPERIENCE"; experience: WorkExperience }
	| {
			type: "UPDATE_WORK_EXPERIENCE";
			id: string;
			field: keyof WorkExperience;
			value: any;
	  }
	| { type: "REMOVE_WORK_EXPERIENCE"; id: string }
	| { type: "ADD_EDUCATION"; education: Education }
	| { type: "UPDATE_EDUCATION"; id: string; field: keyof Education; value: any }
	| { type: "REMOVE_EDUCATION"; id: string }
	| { type: "ADD_SKILL"; skill: Skill }
	| { type: "UPDATE_SKILL"; id: string; field: keyof Skill; value: any }
	| { type: "REMOVE_SKILL"; id: string }
	| { type: "RESET_FORM"; initialState: FormState };

function formReducer(state: FormState, action: FormAction): FormState {
	switch (action.type) {
		case "SET_FIELD":
			return { ...state, [action.field]: action.value };

		case "ADD_WORK_EXPERIENCE":
			return {
				...state,
				workExperiences: [...state.workExperiences, action.experience],
			};

		case "UPDATE_WORK_EXPERIENCE":
			return {
				...state,
				workExperiences: state.workExperiences.map((exp) =>
					exp.id === action.id ? { ...exp, [action.field]: action.value } : exp
				),
			};

		case "REMOVE_WORK_EXPERIENCE":
			return {
				...state,
				workExperiences: state.workExperiences.filter(
					(exp) => exp.id !== action.id
				),
			};

		case "ADD_EDUCATION":
			return { ...state, education: [...state.education, action.education] };

		case "UPDATE_EDUCATION":
			return {
				...state,
				education: state.education.map((edu) =>
					edu.id === action.id ? { ...edu, [action.field]: action.value } : edu
				),
			};

		case "REMOVE_EDUCATION":
			return {
				...state,
				education: state.education.filter((edu) => edu.id !== action.id),
			};

		case "ADD_SKILL":
			return { ...state, skills: [...state.skills, action.skill] };

		case "UPDATE_SKILL":
			return {
				...state,
				skills: state.skills.map((skill) =>
					skill.id === action.id
						? { ...skill, [action.field]: action.value }
						: skill
				),
			};

		case "REMOVE_SKILL":
			return {
				...state,
				skills: state.skills.filter((skill) => skill.id !== action.id),
			};

		case "RESET_FORM":
			return action.initialState;

		default:
			return state;
	}
}

export default function ResumeForm({
	resume,
	onSave,
	onChange,
}: ResumeFormProps) {
	const initialState = useMemo(() => {
		return {
			fullName: resume?.fullName || "",
			email: resume?.email || "",
			phone: resume?.phone || "",
			title: resume?.title || "",
			summary: resume?.summary || "",
			location: resume?.location || "",
			linkedinUrl: resume?.linkedinUrl || "",
			portfolioUrl: resume?.portfolioUrl || "",
			workExperiences: resume?.workExperiences || [],
			education: resume?.education || [],
			skills: resume?.skills || [],
		};
	}, [resume]);

	const [formState, dispatch] = useReducer(formReducer, initialState);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(formState);
	};

	// Helper functions for cleaner code
	const setField = useCallback(
		(field: keyof FormState, value: any) => {
			dispatch({ type: "SET_FIELD", field, value });
			onChange?.();
		},
		[onChange]
	);

	const addWorkExperience = useCallback(() => {
		const newExperience: WorkExperience = {
			id: crypto.randomUUID(),
			company: "",
			position: "",
			startDate: "",
			endDate: null,
			description: "",
			location: "",
			isCurrent: false,
		};
		dispatch({ type: "ADD_WORK_EXPERIENCE", experience: newExperience });
		onChange?.();
	}, [onChange]);

	const updateWorkExperience = useCallback(
		(
			id: string,
			field: keyof WorkExperience,
			value: string | boolean | null
		) => {
			dispatch({ type: "UPDATE_WORK_EXPERIENCE", id, field, value });
			onChange?.();
		},
		[onChange]
	);

	const removeWorkExperience = useCallback(
		(id: string) => {
			dispatch({ type: "REMOVE_WORK_EXPERIENCE", id });
			onChange?.();
		},
		[onChange]
	);

	const addEducation = useCallback(() => {
		const newEducation: Education = {
			id: crypto.randomUUID(),
			institution: "",
			degree: "",
			startDate: "",
			endDate: null,
			gpa: "",
			description: "",
		};
		dispatch({ type: "ADD_EDUCATION", education: newEducation });
		onChange?.();
	}, [onChange]);

	const updateEducation = useCallback(
		(id: string, field: keyof Education, value: string | null) => {
			dispatch({ type: "UPDATE_EDUCATION", id, field, value });
			onChange?.();
		},
		[onChange]
	);

	const removeEducation = useCallback(
		(id: string) => {
			dispatch({ type: "REMOVE_EDUCATION", id });
			onChange?.();
		},
		[onChange]
	);

	const addSkill = useCallback(() => {
		const newSkill: Skill = {
			id: crypto.randomUUID(),
			skillName: "",
			category: "",
			proficiencyLevel: "",
		};
		dispatch({ type: "ADD_SKILL", skill: newSkill });
		onChange?.();
	}, [onChange]);

	const updateSkill = useCallback(
		(id: string, field: keyof Skill, value: string) => {
			dispatch({ type: "UPDATE_SKILL", id, field, value });
			onChange?.();
		},
		[onChange]
	);

	const removeSkill = useCallback(
		(id: string) => {
			dispatch({ type: "REMOVE_SKILL", id });
			onChange?.();
		},
		[onChange]
	);

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Left Column - Contact & Skills */}
				<div className="lg:col-span-1 space-y-6">
					{/* Contact Information */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Contact Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label className="block text-sm font-medium mb-2">
									Full Name <span className="text-red-500">*</span>
								</Label>
								<input
									type="text"
									required
									value={formState.fullName}
									onChange={(e) => setField("fullName", e.target.value)}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
									placeholder="John Doe"
								/>
							</div>
							<div>
								<Label className="block text-sm font-medium mb-2">
									Email <span className="text-red-500">*</span>
								</Label>
								<input
									type="email"
									required
									value={formState.email}
									onChange={(e) => setField("email", e.target.value)}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
									placeholder="john@example.com"
								/>
							</div>
							<div>
								<Label className="block text-sm font-medium mb-2">Phone</Label>
								<input
									type="tel"
									value={formState.phone}
									onChange={(e) => setField("phone", e.target.value)}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
									placeholder="+1 (555) 123-4567"
								/>
							</div>
							<div>
								<Label className="block text-sm font-medium mb-2">
									Location
								</Label>
								<input
									type="text"
									value={formState.location}
									onChange={(e) => setField("location", e.target.value)}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
									placeholder="San Francisco, CA"
								/>
							</div>
							<div>
								<Label className="block text-sm font-medium mb-2">
									LinkedIn URL
								</Label>
								<input
									type="url"
									value={formState.linkedinUrl}
									onChange={(e) => setField("linkedinUrl", e.target.value)}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
									placeholder="https://linkedin.com/in/johndoe"
								/>
							</div>
							<div>
								<Label className="block text-sm font-medium mb-2">
									Portfolio URL
								</Label>
								<input
									type="url"
									value={formState.portfolioUrl}
									onChange={(e) => setField("portfolioUrl", e.target.value)}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
									placeholder="https://johndoe.com"
								/>
							</div>
						</CardContent>
					</Card>

					{/* Skills */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
							<CardTitle className="text-lg">Skills</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addSkill}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Skill
							</Button>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{formState.skills.map((skill) => (
									<div key={skill.id} className="p-4 border rounded-lg">
										<div className="flex justify-between items-start mb-3">
											<h4 className="text-sm font-medium">Skill</h4>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeSkill(skill.id)}
												className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
											>
												<Trash2 size={14} />
											</Button>
										</div>
										<div className="space-y-3">
											<input
												type="text"
												value={skill.skillName}
												onChange={(e) =>
													updateSkill(skill.id, "skillName", e.target.value)
												}
												className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm"
												placeholder="Skill name"
											/>
											<input
												type="text"
												value={skill.category}
												onChange={(e) =>
													updateSkill(skill.id, "category", e.target.value)
												}
												className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm"
												placeholder="Category (e.g., Programming)"
											/>
											<select
												value={skill.proficiencyLevel}
												onChange={(e) =>
													updateSkill(
														skill.id,
														"proficiencyLevel",
														e.target.value
													)
												}
												className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring text-sm"
											>
												<option value="">Select proficiency</option>
												<option value="Beginner">Beginner</option>
												<option value="Intermediate">Intermediate</option>
												<option value="Advanced">Advanced</option>
												<option value="Expert">Expert</option>
											</select>
										</div>
									</div>
								))}
								{formState.skills.length === 0 && (
									<p className="text-center text-slate-500 py-4">
										No skills added yet
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Professional Summary */}
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Professional Summary</CardTitle>
						</CardHeader>
						<CardContent>
							<div>
								<Label className="block text-sm font-medium mb-2">
									Job Title
								</Label>
								<input
									type="text"
									value={formState.title}
									onChange={(e) => setField("title", e.target.value)}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring mb-4"
									placeholder="Software Engineer"
								/>
								<Label className="block text-sm font-medium mb-2">
									Summary
								</Label>
								<textarea
									value={formState.summary}
									onChange={(e) => setField("summary", e.target.value)}
									rows={4}
									className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none"
									placeholder="A brief summary of your professional background and goals..."
								/>
							</div>
						</CardContent>
					</Card>

					{/* Work Experience */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
							<CardTitle className="text-lg">Work Experience</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addWorkExperience}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Experience
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							{formState.workExperiences.map((exp, index) => (
								<div key={exp.id}>
									<div className="p-4 border rounded-lg">
										<div className="flex justify-between items-start mb-4">
											<h4 className="text-sm font-medium">Experience Entry</h4>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeWorkExperience(exp.id)}
												className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
											>
												<Trash2 size={14} />
											</Button>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label className="block text-sm font-medium mb-2">
													Company
												</Label>
												<input
													type="text"
													value={exp.company}
													onChange={(e) =>
														updateWorkExperience(
															exp.id,
															"company",
															e.target.value
														)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
													placeholder="Company Name"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													Position
												</Label>
												<input
													type="text"
													value={exp.position}
													onChange={(e) =>
														updateWorkExperience(
															exp.id,
															"position",
															e.target.value
														)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
													placeholder="Job Title"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													Start Date
												</Label>
												<input
													type="date"
													value={exp.startDate}
													onChange={(e) =>
														updateWorkExperience(
															exp.id,
															"startDate",
															e.target.value
														)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													End Date
												</Label>
												<input
													type="date"
													value={exp.endDate || ""}
													onChange={(e) =>
														updateWorkExperience(
															exp.id,
															"endDate",
															e.target.value || null
														)
													}
													disabled={exp.isCurrent}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring disabled:bg-muted"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													Location
												</Label>
												<input
													type="text"
													value={exp.location}
													onChange={(e) =>
														updateWorkExperience(
															exp.id,
															"location",
															e.target.value
														)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
													placeholder="City, State"
												/>
											</div>
											<div className="flex items-center pt-8">
												<Label className="flex items-center gap-2 cursor-pointer">
													<input
														type="checkbox"
														checked={exp.isCurrent}
														onChange={(e) => {
															updateWorkExperience(
																exp.id,
																"isCurrent",
																e.target.checked
															);
															if (e.target.checked) {
																updateWorkExperience(exp.id, "endDate", null);
															}
														}}
														className="w-4 h-4 text-primary border-input rounded focus:ring-ring"
													/>
													<span className="text-sm font-medium text-foreground">
														Current Position
													</span>
												</Label>
											</div>
											<div className="md:col-span-2">
												<Label className="block text-sm font-medium mb-2">
													Description
												</Label>
												<textarea
													value={exp.description}
													onChange={(e) =>
														updateWorkExperience(
															exp.id,
															"description",
															e.target.value
														)
													}
													rows={3}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none"
													placeholder="Responsibilities and achievements..."
												/>
											</div>
										</div>
									</div>
									{index < formState.workExperiences.length - 1 && (
										<Separator className="mt-4" />
									)}
								</div>
							))}
							{formState.workExperiences.length === 0 && (
								<p className="text-center text-slate-500 py-8">
									No work experience added yet
								</p>
							)}
						</CardContent>
					</Card>

					{/* Education */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
							<CardTitle className="text-lg">Education</CardTitle>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addEducation}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Education
							</Button>
						</CardHeader>
						<CardContent className="space-y-4">
							{formState.education.map((edu, index) => (
								<div key={edu.id}>
									<div className="p-4 border rounded-lg">
										<div className="flex justify-between items-start mb-4">
											<h4 className="text-sm font-medium">Education Entry</h4>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={() => removeEducation(edu.id)}
												className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
											>
												<Trash2 size={14} />
											</Button>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<Label className="block text-sm font-medium mb-2">
													Institution
												</Label>
												<input
													type="text"
													value={edu.institution}
													onChange={(e) =>
														updateEducation(
															edu.id,
															"institution",
															e.target.value
														)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
													placeholder="University Name"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													Degree
												</Label>
												<input
													type="text"
													value={edu.degree}
													onChange={(e) =>
														updateEducation(edu.id, "degree", e.target.value)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
													placeholder="Bachelor of Science in Computer Science"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													Start Date
												</Label>
												<input
													type="date"
													value={edu.startDate}
													onChange={(e) =>
														updateEducation(edu.id, "startDate", e.target.value)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													End Date
												</Label>
												<input
													type="date"
													value={edu.endDate || ""}
													onChange={(e) =>
														updateEducation(
															edu.id,
															"endDate",
															e.target.value || null
														)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
												/>
											</div>
											<div>
												<Label className="block text-sm font-medium mb-2">
													GPA
												</Label>
												<input
													type="text"
													value={edu.gpa}
													onChange={(e) =>
														updateEducation(edu.id, "gpa", e.target.value)
													}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
													placeholder="3.8"
												/>
											</div>
											<div className="md:col-span-2">
												<Label className="block text-sm font-medium mb-2">
													Description
												</Label>
												<textarea
													value={edu.description}
													onChange={(e) =>
														updateEducation(
															edu.id,
															"description",
															e.target.value
														)
													}
													rows={2}
													className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring resize-none"
													placeholder="Relevant coursework, honors, activities..."
												/>
											</div>
										</div>
									</div>
									{index < formState.education.length - 1 && (
										<Separator className="mt-4" />
									)}
								</div>
							))}
							{formState.education.length === 0 && (
								<p className="text-center text-slate-500 py-8">
									No education added yet
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</form>
	);
}
