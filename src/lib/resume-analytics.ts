import type {
	Resume,
	ResumeActivityEvent,
	TeamMember,
	PipelineStats,
} from "./types";

export function countWords(text: string | undefined | null): number {
	if (!text?.trim()) return 0;
	return text.trim().split(/\s+/).filter(Boolean).length;
}

export function getResumeWordCount(resume: Resume): number {
	let n = 0;
	n += countWords(resume.summary);
	n += countWords(resume.title);
	for (const w of resume.workExperiences) {
		n += countWords(w.company);
		n += countWords(w.position);
		n += countWords(w.description);
	}
	for (const e of resume.education) {
		n += countWords(e.institution);
		n += countWords(e.degree);
		n += countWords(e.description);
	}
	for (const s of resume.skills) {
		n += countWords(s.skillName);
	}
	return n;
}

export function getWordCountBreakdown(resume: Resume): Record<string, number> {
	return {
		summary: countWords(resume.summary),
		experience: resume.workExperiences.reduce(
			(a, w) =>
				a +
				countWords(w.description) +
				countWords(w.company) +
				countWords(w.position),
			0
		),
		education: resume.education.reduce(
			(a, e) =>
				a +
				countWords(e.description) +
				countWords(e.institution) +
				countWords(e.degree),
			0
		),
		skills: resume.skills.reduce((a, s) => a + countWords(s.skillName), 0),
	};
}

/** 0–100 weighted checklist of profile completeness */
export function completionScore(resume: Resume): number {
	let s = 0;
	if (resume.fullName?.trim()) s += 15;
	if (resume.email?.trim()) s += 15;
	if (resume.title?.trim()) s += 10;
	if ((resume.summary?.trim().length ?? 0) > 50) s += 15;
	else if (resume.summary?.trim()) s += 8;
	if (resume.workExperiences.length > 0) s += 20;
	if (resume.education.length > 0) s += 10;
	if (resume.skills.length >= 3) s += 10;
	else if (resume.skills.length > 0) s += 5;
	if (resume.linkedinUrl?.trim() || resume.portfolioUrl?.trim()) s += 5;
	return Math.min(100, s);
}

function hashString(str: string): number {
	let h = 0;
	for (let i = 0; i < str.length; i++) {
		h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
	}
	return Math.abs(h);
}

/** Stable illustrative funnel numbers when `pipelineStats` is absent */
export function deterministicPipelineStats(memberId: string): PipelineStats {
	const h = hashString(memberId);
	return {
		applications: 3 + (h % 8),
		interviews: 1 + (h % 4),
		offers: h % 3,
	};
}

export function getPipelineStats(member: TeamMember): PipelineStats {
	return member.pipelineStats ?? deterministicPipelineStats(member.id);
}

export function aggregateOrgStats(resumes: Resume[]) {
	if (resumes.length === 0) {
		return {
			totalResumes: 0,
			avgCompletion: 0,
			totalWords: 0,
			lastUpdatedLabel: "—",
		};
	}
	const totalWords = resumes.reduce((a, r) => a + getResumeWordCount(r), 0);
	const avgCompletion =
		resumes.reduce((a, r) => a + completionScore(r), 0) / resumes.length;
	const newest = [...resumes].sort(
		(a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
	)[0];
	return {
		totalResumes: resumes.length,
		avgCompletion: Math.round(avgCompletion),
		totalWords,
		lastUpdatedLabel: new Date(newest.updatedAt).toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
			year: "numeric",
		}),
	};
}

function startOfWeek(d: Date): Date {
	const x = new Date(d);
	const day = x.getDay();
	const diff = x.getDate() - day + (day === 0 ? -6 : 1);
	x.setDate(diff);
	x.setHours(0, 0, 0, 0);
	return x;
}

/** Buckets `updatedAt` into the last `numWeeks` weeks (Mon-based week start). */
export function weeklyUpdateBuckets(
	resumes: Resume[],
	numWeeks = 8
): { label: string; count: number }[] {
	const weeks: { key: string; label: string }[] = [];
	const now = new Date();
	for (let i = numWeeks - 1; i >= 0; i--) {
		const d = new Date(now);
		d.setDate(d.getDate() - i * 7);
		const sw = startOfWeek(d);
		const key = sw.toISOString().slice(0, 10);
		const label = sw.toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
		});
		weeks.push({ key, label });
	}
	const countMap = new Map<string, number>();
	for (const w of weeks) countMap.set(w.key, 0);
	for (const r of resumes) {
		const sw = startOfWeek(new Date(r.updatedAt));
		const k = sw.toISOString().slice(0, 10);
		if (countMap.has(k)) {
			countMap.set(k, (countMap.get(k) ?? 0) + 1);
		}
	}
	return weeks.map((w) => ({
		label: w.label,
		count: countMap.get(w.key) ?? 0,
	}));
}

export function aggregatePipelineFunnel(members: TeamMember[]): {
	stage: string;
	count: number;
}[] {
	let apps = 0;
	let intv = 0;
	let off = 0;
	for (const m of members) {
		const p = getPipelineStats(m);
		apps += p.applications;
		intv += p.interviews;
		off += p.offers;
	}
	return [
		{ stage: "Applications", count: apps },
		{ stage: "Interviews", count: intv },
		{ stage: "Offers", count: off },
	];
}

/** Newest-first timeline; if no log, synthetic “created” from `createdAt`. */
export function getActivityTimeline(resume: Resume): ResumeActivityEvent[] {
	const log = resume.activityLog;
	if (log && log.length > 0) {
		return [...log].sort(
			(a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
		);
	}
	return [
		{
			id: "legacy-created",
			at: resume.createdAt,
			label: "Resume created",
		},
	];
}

export interface TeamMemberChartRow {
	memberId: string;
	name: string;
	linkedResumes: number;
	avgWords: number;
	avgCompletion: number;
	pipeline: PipelineStats;
}

export function buildTeamComparisonRows(
	members: TeamMember[],
	resumes: Resume[]
): TeamMemberChartRow[] {
	return members.map((m) => {
		const linked = m.resumeIds
			.map((id) => resumes.find((r) => r.id === id))
			.filter((r): r is Resume => r != null);
		const avgWords =
			linked.length === 0
				? 0
				: Math.round(
						linked.reduce((a, r) => a + getResumeWordCount(r), 0) /
							linked.length
				  );
		const avgCompletion =
			linked.length === 0
				? 0
				: Math.round(
						linked.reduce((a, r) => a + completionScore(r), 0) / linked.length
				  );
		return {
			memberId: m.id,
			name: m.fullName,
			linkedResumes: linked.length,
			avgWords,
			avgCompletion,
			pipeline: getPipelineStats(m),
		};
	});
}
