import { Link } from "react-router";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	aggregateOrgStats,
	aggregatePipelineFunnel,
	completionScore,
	getResumeWordCount,
} from "@/lib/resume-analytics";
import { useResumes, useTeamStore } from "@/lib/store";
import { BarChart3, ArrowLeft } from "lucide-react";

const funnelChartConfig = {
	count: {
		label: "Count",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export default function Insights() {
	const resumes = useResumes();
	const members = useTeamStore((s) => s.teamMembers);
	const org = aggregateOrgStats(resumes);
	const funnel = aggregatePipelineFunnel(members);

	const rows = [...resumes].sort(
		(a, b) =>
			new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
	);

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">
					<div className="flex flex-wrap items-start justify-between gap-4">
						<div className="flex items-center gap-3">
							<BarChart3 className="h-7 w-7" />
							<div>
								<h1 className="text-2xl font-semibold tracking-tight">
									Insights &amp; stats
								</h1>
								<p className="text-muted-foreground text-sm mt-1">
									Metrics derived from your saved resumes and team (pipeline
									totals are illustrative demos unless you add real data later).
								</p>
							</div>
						</div>
						<Button variant="outline" size="sm" asChild>
							<Link to="/" className="gap-2">
								<ArrowLeft className="h-4 w-4" />
								Back to dashboard
							</Link>
						</Button>
					</div>

					<div className="grid gap-4 sm:grid-cols-3">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Total resumes</CardDescription>
								<CardTitle className="text-3xl tabular-nums">
									{org.totalResumes}
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Average completion</CardDescription>
								<CardTitle className="text-3xl tabular-nums">
									{org.avgCompletion}%
								</CardTitle>
							</CardHeader>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Total words</CardDescription>
								<CardTitle className="text-3xl tabular-nums">
									{org.totalWords.toLocaleString()}
								</CardTitle>
							</CardHeader>
						</Card>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Team pipeline (demo)</CardTitle>
								<CardDescription>
									Sum of illustrative application funnel metrics per team
									member. Customize in data model when integrating a real API.
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ChartContainer
									config={funnelChartConfig}
									className="min-h-[240px] w-full"
								>
									<BarChart
										accessibilityLayer
										data={funnel}
										layout="vertical"
										margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
									>
										<CartesianGrid horizontal={false} />
										<XAxis
											type="number"
											allowDecimals={false}
											tickLine={false}
											axisLine={false}
										/>
										<YAxis
											type="category"
											dataKey="stage"
											width={100}
											tickLine={false}
											axisLine={false}
										/>
										<ChartTooltip
											content={<ChartTooltipContent />}
											cursor={{ fill: "var(--muted)", opacity: 0.35 }}
										/>
										<Bar
											dataKey="count"
											fill="var(--color-count)"
											radius={[0, 4, 4, 0]}
										/>
									</BarChart>
								</ChartContainer>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Per-resume breakdown</CardTitle>
								<CardDescription>
									Word counts and completion scores computed client-side.
								</CardDescription>
							</CardHeader>
							<CardContent className="px-0 sm:px-6">
								{rows.length === 0 ? (
									<p className="text-sm text-muted-foreground px-6">
										No resumes yet. Create one from the dashboard.
									</p>
								) : (
									<div className="overflow-x-auto rounded-md border mx-4 sm:mx-0">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead className="text-right">Words</TableHead>
													<TableHead className="text-right">Completion</TableHead>
													<TableHead className="text-right hidden sm:table-cell">
														Updated
													</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{rows.map((r) => (
													<TableRow key={r.id}>
														<TableCell className="font-medium max-w-[180px] truncate">
															<Link
																to={`/resume/${r.id}`}
																className="hover:underline"
															>
																{r.fullName || "Untitled"}
															</Link>
														</TableCell>
														<TableCell className="text-right tabular-nums">
															{getResumeWordCount(r).toLocaleString()}
														</TableCell>
														<TableCell className="text-right">
															<Badge variant="secondary">
																{completionScore(r)}%
															</Badge>
														</TableCell>
														<TableCell className="text-right text-muted-foreground text-sm hidden sm:table-cell">
															{new Date(r.updatedAt).toLocaleDateString()}
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
