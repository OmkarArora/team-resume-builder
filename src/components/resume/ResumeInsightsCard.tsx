import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	completionScore,
	getActivityTimeline,
	getResumeWordCount,
	getWordCountBreakdown,
} from "@/lib/resume-analytics";
import type { Resume } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function CompletionRing({ score }: { score: number }) {
	const r = 16;
	const c = 2 * Math.PI * r;
	const dash = (score / 100) * c;
	return (
		<div className="flex items-center gap-4">
			<svg
				viewBox="0 0 40 40"
				className="h-20 w-20 shrink-0 -rotate-90"
				aria-hidden
			>
				<circle
					cx="20"
					cy="20"
					r={r}
					fill="none"
					className="stroke-muted"
					strokeWidth="4"
				/>
				<circle
					cx="20"
					cy="20"
					r={r}
					fill="none"
					className="stroke-primary transition-[stroke-dashoffset] duration-500"
					strokeWidth="4"
					strokeLinecap="round"
					strokeDasharray={`${dash} ${c}`}
				/>
			</svg>
			<div>
				<p className="text-3xl font-semibold tabular-nums">{score}%</p>
				<p className="text-sm text-muted-foreground">Profile completion</p>
			</div>
		</div>
	);
}

export function ResumeInsightsCard({ resume }: { resume: Resume }) {
	const score = completionScore(resume);
	const words = getResumeWordCount(resume);
	const breakdown = getWordCountBreakdown(resume);
	const timeline = getActivityTimeline(resume).slice(0, 10);

	return (
		<Card data-tour="resume-insights">
			<CardHeader>
				<CardTitle className="text-lg">Insights</CardTitle>
				<CardDescription>
					Word counts and completion are computed from this resume&apos;s
					content.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<CompletionRing score={score} />

				<div>
					<p className="text-sm font-medium mb-1">Total words</p>
					<p className="text-2xl font-semibold tabular-nums">
						{words.toLocaleString()}
					</p>
					<ul className="mt-2 text-sm text-muted-foreground space-y-1">
						<li>Summary: {breakdown.summary.toLocaleString()}</li>
						<li>Experience: {breakdown.experience.toLocaleString()}</li>
						<li>Education: {breakdown.education.toLocaleString()}</li>
						<li>Skills: {breakdown.skills.toLocaleString()}</li>
					</ul>
				</div>

				<Separator />

				<div>
					<p className="text-sm font-medium mb-2">Recent activity</p>
					<ul className="space-y-2 text-sm max-h-[200px] overflow-y-auto pr-1">
						{timeline.map((ev) => (
							<li
								key={ev.id}
								className="flex flex-col gap-0.5 border-l-2 border-muted pl-3 py-0.5"
							>
								<span className="text-foreground">{ev.label}</span>
								<span className="text-xs text-muted-foreground">
									{formatDate(ev.at)}
								</span>
							</li>
						))}
					</ul>
				</div>
			</CardContent>
		</Card>
	);
}
