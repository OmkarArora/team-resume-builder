import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Plus, Edit, Trash2, Users, UserPlus } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { SearchBar } from "@/components/ui/search-bar";
import AddMemberDialog from "@/components/team/AddMemberDialog";
import { useTeamStore } from "@/lib/store";
import type { TeamMember } from "@/lib/types";
// import type { TeamMember } from "@/lib/types";

export default function Team() {
	const members = useTeamStore((s) => s.teamMembers);
	const deleteMember = useTeamStore((s) => s.deleteMember);

	const [query, setQuery] = useState("");

	// Add Member dialog state
	const [open, setOpen] = useState(false);

	// Delete confirmation dialog state
	const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return members;
		return members.filter(
			(m) =>
				m.fullName.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)
		);
	}, [members, query]);

	const handleDeleteMember = () => {
		if (memberToDelete) {
			deleteMember(memberToDelete.id);
			setMemberToDelete(null);
		}
	};

	return (
		<div className="flex flex-1 flex-col">
			<div className="@container/main flex flex-1 flex-col gap-2">
				{/* Header */}
				<div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
					<div
						className="flex items-center justify-between px-4 lg:px-6 flex-wrap gap-4"
						data-tour="team-header"
					>
						<div className="flex items-center gap-3">
							<Users className="h-6 w-6" />
							<p className="text-foreground">Manage your team members</p>
						</div>
						<div className="flex items-center gap-2 flex-wrap">
							<SearchBar
								value={query}
								onChange={setQuery}
								placeholder="Search members..."
								ariaLabel="Search members"
								className="w-full sm:w-[200px] md:w-56"
							/>
							<Button onClick={() => setOpen(true)} data-tour="add-member-btn">
								<UserPlus className="h-4 w-4" />
								Add Member
							</Button>
						</div>
					</div>

					<div className="px-4 lg:px-6">
						{filtered.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="rounded-full bg-muted p-6">
									<Plus className="h-8 w-8 text-muted-foreground" />
								</div>
								<h3 className="mt-4 text-lg font-semibold">No team members</h3>
								<p className="mt-2 text-sm text-muted-foreground">
									Create your first team member to get started
								</p>
								<Button className="mt-4" onClick={() => setOpen(true)}>
									<UserPlus className="h-4 w-4" />
									Add Member
								</Button>
							</div>
						) : (
							<div className="flex gap-4 flex-wrap">
								{filtered.map((m) => (
									<TeamMemberCard
										key={m.id}
										member={m}
										onDeleteClick={() => setMemberToDelete(m)}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			<AddMemberDialog open={open} onOpenChange={setOpen} />

			<ConfirmationDialog
				open={!!memberToDelete}
				onOpenChange={(open) => !open && setMemberToDelete(null)}
				title="Delete Team Member"
				description={
					memberToDelete
						? `Are you sure you want to delete ${memberToDelete.fullName}? This action cannot be undone and will remove all linked resumes from this member.`
						: ""
				}
				confirmText="Delete"
				cancelText="Cancel"
				onConfirm={handleDeleteMember}
				variant="default"
			/>
		</div>
	);
}

function TeamMemberCard({
	member: m,
	onDeleteClick,
}: {
	member: TeamMember;
	onDeleteClick: () => void;
}) {
	const updateMember = useTeamStore((s) => s.updateMember);

	return (
		<Card className="hover:shadow-md transition-shadow py-4 px-6 w-full md:w-[320px] ">
			<CardHeader className="pb-3 px-0">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<CardTitle className="text-lg">{m.fullName}</CardTitle>
						<p className="text-sm text-muted-foreground">{m.role}</p>
					</div>
					<Badge variant="outline" className="text-xs">
						{m.resumeIds.length} resume
						{m.resumeIds.length !== 1 ? "s" : ""}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pt-0 px-0 flex-1">
				<div className="space-y-3">
					{m.email && (
						<p className="text-sm text-muted-foreground">{m.email}</p>
					)}
				</div>
			</CardContent>
			<CardFooter className="flex items-center gap-2 p-0 flex-wrap">
				<Button variant="outline" size="sm" asChild className="flex-1">
					<Link to={`/team/${m.id}`}>View</Link>
				</Button>
				<Button
					variant="outline"
					size="sm"
					className="flex-1"
					onClick={() =>
						updateMember(m.id, {
							fullName: m.fullName,
							role: m.role,
							email: m.email,
							avatarUrl: m.avatarUrl,
							resumeIds: m.resumeIds,
						})
					}
				>
					<Edit className="h-4 w-4" />
					Edit
				</Button>
				<Button
					variant="destructive"
					size="sm"
					className="px-3"
					onClick={onDeleteClick}
				>
					<Trash2 className="h-4 w-4" />
				</Button>
			</CardFooter>
		</Card>
	);
}
