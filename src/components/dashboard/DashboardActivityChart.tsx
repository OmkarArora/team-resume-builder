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
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { weeklyUpdateBuckets } from "@/lib/resume-analytics";
import type { Resume } from "@/lib/types";

const chartConfig = {
	count: {
		label: "Resumes updated",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function DashboardActivityChart({ resumes }: { resumes: Resume[] }) {
	const data = weeklyUpdateBuckets(resumes, 8);

	return (
		<Card>
			<CardHeader>
				<CardTitle>Resume activity</CardTitle>
				<CardDescription>
					Number of resumes updated per week (based on last saved time).
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[260px] w-full">
					<BarChart
						accessibilityLayer
						data={data}
						margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
					>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey="label"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<YAxis
							allowDecimals={false}
							width={32}
							tickLine={false}
							axisLine={false}
						/>
						<ChartTooltip
							content={<ChartTooltipContent />}
							labelFormatter={(_, payload) => {
								const row = payload?.[0]?.payload as
									| { label?: string }
									| undefined;
								return row?.label != null
									? `Week of ${String(row.label)}`
									: "";
							}}
							cursor={{ fill: "var(--muted)", opacity: 0.35 }}
						/>
						<Bar
							dataKey="count"
							fill="var(--color-count)"
							radius={4}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
