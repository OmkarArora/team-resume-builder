import { describe, it, expect } from "vitest";
import {
	countWords,
	completionScore,
	getResumeWordCount,
	deterministicPipelineStats,
	aggregateOrgStats,
	weeklyUpdateBuckets,
	getActivityTimeline,
} from "./resume-analytics";
import type { Resume } from "./types";

const minimalResume = (overrides: Partial<Resume> = {}): Resume => ({
	id: "r1",
	fullName: "Test User",
	email: "t@example.com",
	phone: "",
	title: "Engineer",
	summary: "A".repeat(60),
	location: "",
	linkedinUrl: "",
	portfolioUrl: "",
	workExperiences: [
		{
			id: "w1",
			company: "Co",
			position: "Dev",
			startDate: "2020-01-01",
			endDate: null,
			description: "Did things daily.",
			location: "",
			isCurrent: true,
		},
	],
	education: [
		{
			id: "e1",
			institution: "Uni",
			degree: "BS CS",
			startDate: "2015-09-01",
			endDate: "2019-05-01",
			gpa: "3.5",
			description: "",
		},
	],
	skills: [
		{
			id: "s1",
			skillName: "React",
			category: "FE",
			proficiencyLevel: "Expert",
		},
		{
			id: "s2",
			skillName: "Node",
			category: "BE",
			proficiencyLevel: "Advanced",
		},
		{
			id: "s3",
			skillName: "TS",
			category: "Lang",
			proficiencyLevel: "Expert",
		},
	],
	createdAt: "2024-01-01T00:00:00.000Z",
	updatedAt: "2024-06-01T00:00:00.000Z",
	...overrides,
});

describe("resume-analytics", () => {
	it("countWords handles empty and whitespace", () => {
		expect(countWords("")).toBe(0);
		expect(countWords("   a   b   ")).toBe(2);
	});

	it("completionScore returns 0–100", () => {
		const r = minimalResume();
		const s = completionScore(r);
		expect(s).toBeGreaterThanOrEqual(0);
		expect(s).toBeLessThanOrEqual(100);
	});

	it("getResumeWordCount is positive for filled resume", () => {
		expect(getResumeWordCount(minimalResume())).toBeGreaterThan(10);
	});

	it("deterministicPipelineStats is stable per id", () => {
		expect(deterministicPipelineStats("m1")).toEqual(
			deterministicPipelineStats("m1")
		);
		expect(deterministicPipelineStats("m1")).not.toEqual(
			deterministicPipelineStats("m2")
		);
	});

	it("aggregateOrgStats handles empty list", () => {
		expect(aggregateOrgStats([]).totalResumes).toBe(0);
	});

	it("weeklyUpdateBuckets returns 8 rows", () => {
		const r = minimalResume({
			updatedAt: new Date().toISOString(),
		});
		expect(weeklyUpdateBuckets([r], 8)).toHaveLength(8);
	});

	it("getActivityTimeline falls back to created when no log", () => {
		const r = minimalResume({ activityLog: undefined });
		const t = getActivityTimeline(r);
		expect(t.length).toBeGreaterThanOrEqual(1);
		expect(t[0]?.label).toMatch(/created/i);
	});

	it("getActivityTimeline prefers stored log", () => {
		const r = minimalResume({
			activityLog: [
				{
					id: "1",
					at: "2024-02-01T00:00:00.000Z",
					label: "Edited",
				},
			],
		});
		expect(getActivityTimeline(r)[0]?.label).toBe("Edited");
	});
});
