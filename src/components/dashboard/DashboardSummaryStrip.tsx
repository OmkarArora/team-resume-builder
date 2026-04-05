import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { aggregateOrgStats } from "@/lib/resume-analytics";
import type { Resume } from "@/lib/types";
import { Calendar, FileText, Target, Type, ArrowRight } from "lucide-react";

export function DashboardSummaryStrip({ resumes }: { resumes: Resume[] }) {
	const stats = aggregateOrgStats(resumes);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Resumes
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-semibold tabular-nums">
							{stats.totalResumes}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Avg. completion
						</CardTitle>
						<Target className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-semibold tabular-nums">
							{stats.avgCompletion}%
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Total words
						</CardTitle>
						<Type className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-semibold tabular-nums">
							{stats.totalWords.toLocaleString()}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Last updated
						</CardTitle>
						<Calendar className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<p className="text-lg font-semibold">{stats.lastUpdatedLabel}</p>
					</CardContent>
				</Card>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="text-sm text-muted-foreground">
					See word counts, completion scores, and team comparisons on Insights.
				</p>
				<Button variant="outline" size="sm" asChild>
					<Link to="/insights" className="gap-2">
						Open Insights
						<ArrowRight className="h-4 w-4" />
					</Link>
				</Button>
			</div>
		</div>
	);
}
