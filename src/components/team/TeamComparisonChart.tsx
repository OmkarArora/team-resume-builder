import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { buildTeamComparisonRows } from "@/lib/resume-analytics";
import type { Resume, TeamMember } from "@/lib/types";

const chartConfig = {
	linkedResumes: {
		label: "Linked resumes",
		color: "var(--chart-1)",
	},
	avgCompletion: {
		label: "Avg completion %",
		color: "var(--chart-2)",
	},
	applications: {
		label: "Applications (demo)",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig;

export function TeamComparisonChart({
	members,
	resumes,
}: {
	members: TeamMember[];
	resumes: Resume[];
}) {
	if (members.length === 0) {
		return null;
	}

	const rows = buildTeamComparisonRows(members, resumes);
	const data = rows.map((r) => ({
		name:
			r.name.length > 14 ? `${r.name.slice(0, 12).trim()}…` : r.name,
		linkedResumes: r.linkedResumes,
		avgCompletion: r.avgCompletion,
		applications: r.pipeline.applications,
	}));

	return (
		<Card className="mt-6">
			<CardHeader>
				<CardTitle>Team comparison</CardTitle>
				<CardDescription>
					<strong className="text-foreground">Linked resumes</strong> and{" "}
					<strong className="text-foreground">avg. completion</strong> come from
					resume data. <strong className="text-foreground">Applications</strong>{" "}
					uses per-member demo pipeline values (see Insights for totals).
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[300px] w-full">
					<BarChart
						accessibilityLayer
						data={data}
						margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="name"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							interval={0}
							tick={{ fontSize: 11 }}
						/>
						<YAxis
							allowDecimals={false}
							width={40}
							tickLine={false}
							axisLine={false}
							tick={{ fontSize: 11 }}
						/>
						<ChartTooltip
							content={<ChartTooltipContent />}
							cursor={{ fill: "var(--muted)", opacity: 0.35 }}
						/>
						<ChartLegend content={<ChartLegendContent />} />
						<Bar
							dataKey="linkedResumes"
							fill="var(--color-linkedResumes)"
							radius={4}
						/>
						<Bar
							dataKey="avgCompletion"
							fill="var(--color-avgCompletion)"
							radius={4}
						/>
						<Bar
							dataKey="applications"
							fill="var(--color-applications)"
							radius={4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
