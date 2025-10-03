export interface WorkExperience {
	id: string;
	company: string;
	position: string;
	startDate: string;
	endDate: string | null;
	description: string;
	location: string;
	isCurrent: boolean;
}

export interface Education {
	id: string;
	institution: string;
	degree: string;
	startDate: string;
	endDate: string | null;
	gpa: string;
	description: string;
}

export interface Skill {
	id: string;
	skillName: string;
	category: string;
	proficiencyLevel: string;
}

export interface Resume {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	title: string;
	summary: string;
	location: string;
	linkedinUrl: string;
	portfolioUrl: string;
	workExperiences: WorkExperience[];
	education: Education[];
	skills: Skill[];
	createdAt: string;
	updatedAt: string;
}

export interface TeamMember {
	id: string;
	fullName: string;
	role: string;
	email: string;
	avatarUrl?: string;
	resumeIds: string[];
	createdAt: string;
	updatedAt: string;
}
