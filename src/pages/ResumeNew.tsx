import { useNavigate } from "react-router";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResumeForm from "@/components/resume/ResumeForm";
import { useResumeStore, useTeamStore } from "@/lib/store";
import type { Resume } from "@/lib/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import BackButton from "@/components/ui/back-button";

export default function ResumeNew() {
	const navigate = useNavigate();
	const addResume = useResumeStore((state) => state.addResume);
	const teamMembers = useTeamStore((s) => s.teamMembers);
	const linkResumeToMember = useTeamStore((s) => s.linkResumeToMember);
	const [selectedMemberId, setSelectedMemberId] = useState<string | "">("");

	const sortedMembers = useMemo(
		() => [...teamMembers].sort((a, b) => a.fullName.localeCompare(b.fullName)),
		[teamMembers]
	);

	const selectedMember = useMemo(
		() => teamMembers.find((m) => m.id === selectedMemberId),
		[teamMembers, selectedMemberId]
	);

	const handleSave = (data: Omit<Resume, "id" | "createdAt" | "updatedAt">) => {
		addResume(data);
		const newId = useResumeStore.getState().currentResume?.id;
		if (newId && selectedMemberId) {
			linkResumeToMember(selectedMemberId, newId);
		}
		toast.success("Resume created successfully!");
		navigate("/");
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div className="flex items-center justify-between px-4 lg:px-6">
						<div className="flex items-center gap-4">
							<BackButton />
							<div>
								<h1 className="text-3xl font-bold tracking-tight">
									New Resume
								</h1>
								<p className="text-muted-foreground">Create a new resume</p>
							</div>
						</div>
						<Button
							size="sm"
							onClick={() => {
								const form = document.querySelector("form");
								if (form) form.requestSubmit();
							}}
						>
							<Save className="mr-2 h-4 w-4" /> Save
						</Button>
					</div>

					<div className="px-4 lg:px-6">
						<div className="max-w-4xl mx-auto space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="text-lg">
										Link Team Member (optional)
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-2">
									<Label className="block text-sm font-medium mb-2">
										Team Member
									</Label>
									<Select
										value={selectedMemberId || "none"}
										onValueChange={(v) =>
											setSelectedMemberId(v === "none" ? "" : v)
										}
									>
										<SelectTrigger className="w-full">
											<SelectValue placeholder="Select a team member to link" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="none">None</SelectItem>
											{sortedMembers.map((m) => (
												<SelectItem key={m.id} value={m.id}>
													{m.fullName} {m.role ? `• ${m.role}` : ""}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</CardContent>
							</Card>

							<ResumeForm
								onSave={handleSave}
								prefillFullName={selectedMember?.fullName ?? undefined}
								prefillEmail={selectedMember?.email ?? undefined}
								prefillTitle={selectedMember?.role ?? undefined}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
