import { Link, useParams } from "react-router";
import { ArrowLeft, Link2, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTeamStore, useResumes } from "@/lib/store";
import BackButton from "@/components/ui/back-button";

export default function TeamMember() {
	const { id } = useParams<{ id: string }>();
	const member = useTeamStore((s) => s.getMember(id || ""));
	const resumes = useResumes();

	const linkResumeToMember = useTeamStore((s) => s.linkResumeToMember);
	const unlinkResumeFromMember = useTeamStore((s) => s.unlinkResumeFromMember);

	if (!id || !member) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Team Member Not Found</h1>
					<p className="text-muted-foreground mt-2">
						The member doesn't exist.
					</p>
					<Button asChild className="mt-4">
						<Link to="/team">
							<div className="flex items-center gap-2">
								<ArrowLeft className="h-4 w-4" />
								Back to Team
							</div>
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	const linkedResumes = resumes.filter((r) => member.resumeIds.includes(r.id));
	const unlinkedResumes = resumes.filter(
		(r) => !member.resumeIds.includes(r.id)
	);

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="flex items-center justify-between px-4 lg:px-6">
						<div className="flex items-center gap-4">
							<BackButton />
							<div className="flex items-baseline flex-wrap gap-2">
								<h1 className="text-3xl font-bold tracking-tight">
									{member.fullName}
								</h1>
								<p className="text-muted-foreground">{member.role}</p>
							</div>
						</div>
					</div>

					<div className="px-4 lg:px-6">
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-1 space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Member Info</CardTitle>
									</CardHeader>
									<CardContent className="space-y-2">
										<div className="text-sm">
											<div className="text-muted-foreground">Email</div>
											<div>{member.email || "—"}</div>
										</div>
										<div className="text-sm">
											<div className="text-muted-foreground">Role</div>
											<div>{member.role}</div>
										</div>
										<div className="text-sm">
											<div className="text-muted-foreground">
												Resumes Linked
											</div>
											<div>
												<Badge variant="secondary" className="text-xs">
													{member.resumeIds.length}
												</Badge>
											</div>
										</div>
									</CardContent>
								</Card>
							</div>

							<div className="lg:col-span-2 space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Linked Resumes</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										{linkedResumes.length === 0 ? (
											<p className="text-sm text-muted-foreground">
												No linked resumes.
											</p>
										) : (
											linkedResumes.map((r, index) => (
												<div key={r.id}>
													<div className="flex items-start justify-between">
														<div>
															<h4 className="font-semibold">{r.fullName}</h4>
															<p className="text-sm text-muted-foreground">
																{r.title}
															</p>
														</div>
														<div className="flex items-center gap-2">
															<Button variant="outline" size="sm" asChild>
																<Link to={`/resume/${r.id}`}>View</Link>
															</Button>
															<Button
																variant="outline"
																size="sm"
																onClick={() =>
																	unlinkResumeFromMember(member.id, r.id)
																}
															>
																<Unlink className="h-4 w-4" /> Unlink
															</Button>
														</div>
													</div>
													{index < linkedResumes.length - 1 && (
														<Separator className="mt-4" />
													)}
												</div>
											))
										)}
									</CardContent>
								</Card>

								<Card>
									<CardHeader>
										<CardTitle className="text-lg">Available Resumes</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{unlinkedResumes.length === 0 ? (
											<p className="text-sm text-muted-foreground">
												All resumes are linked.
											</p>
										) : (
											unlinkedResumes.map((r) => (
												<div
													key={r.id}
													className="flex items-center justify-between"
												>
													<div>
														<div className="text-sm font-medium">
															{r.fullName}
														</div>
														<div className="text-xs text-muted-foreground">
															{r.title}
														</div>
													</div>
													<Button
														variant="outline"
														size="sm"
														onClick={() => linkResumeToMember(member.id, r.id)}
													>
														<Link2 className="h-4 w-4" /> Link
													</Button>
												</div>
											))
										)}
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
