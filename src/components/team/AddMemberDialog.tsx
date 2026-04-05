import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useTeamStore } from "@/lib/store";
import type { TeamMember } from "@/lib/types";

interface AddMemberDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** When set, the dialog edits this member instead of creating one */
	memberToEdit?: TeamMember | null;
}

export default function AddMemberDialog({
	open,
	onOpenChange,
	memberToEdit = null,
}: AddMemberDialogProps) {
	const addMember = useTeamStore((s) => s.addMember);
	const updateMember = useTeamStore((s) => s.updateMember);

	const [fullName, setFullName] = useState("");
	const [role, setRole] = useState("");
	const [email, setEmail] = useState("");
	const [avatarUrl, setAvatarUrl] = useState("");
	const [errors, setErrors] = useState<{
		fullName?: string;
		role?: string;
		email?: string;
	}>({});

	const resetForm = () => {
		setFullName("");
		setRole("");
		setEmail("");
		setAvatarUrl("");
		setErrors({});
	};

	useEffect(() => {
		if (!open) return;
		if (memberToEdit) {
			setFullName(memberToEdit.fullName);
			setRole(memberToEdit.role);
			setEmail(memberToEdit.email ?? "");
			setAvatarUrl(memberToEdit.avatarUrl ?? "");
			setErrors({});
		} else {
			resetForm();
		}
	}, [open, memberToEdit]);

	const validate = () => {
		const next: { fullName?: string; role?: string; email?: string } = {};
		if (!fullName.trim()) next.fullName = "Full name is required";
		if (!role.trim()) next.role = "Role is required";
		if (email.trim()) {
			const emailOk = /^(?:[^\s@]+@[^\s@]+\.[^\s@]+)$/i.test(email.trim());
			if (!emailOk) next.email = "Enter a valid email";
		}
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSave = () => {
		if (!validate()) return;
		if (memberToEdit) {
			updateMember(memberToEdit.id, {
				fullName: fullName.trim(),
				role: role.trim(),
				email: email.trim(),
				avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : undefined,
				resumeIds: memberToEdit.resumeIds,
			});
		} else {
			const payload: Omit<TeamMember, "id" | "createdAt" | "updatedAt"> = {
				fullName: fullName.trim(),
				role: role.trim(),
				email: email.trim(),
				avatarUrl: avatarUrl.trim() ? avatarUrl.trim() : undefined,
				resumeIds: [],
			};
			addMember(payload);
		}
		onOpenChange(false);
		resetForm();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				onOpenChange(o);
				if (!o) resetForm();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{memberToEdit ? "Edit team member" : "Add team member"}
					</DialogTitle>
					<DialogDescription>
						{memberToEdit
							? "Update this member’s details. Linked resumes are unchanged."
							: "Create a new member by filling out the details below."}
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="grid gap-2">
						<Label htmlFor="fullName">Full name</Label>
						<Input
							id="fullName"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder="Jane Doe"
						/>
						{errors.fullName && (
							<p className="text-sm text-red-600">{errors.fullName}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="role">Role</Label>
						<Input
							id="role"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							placeholder="Product Designer"
						/>
						{errors.role && (
							<p className="text-sm text-red-600">{errors.role}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="jane@company.com"
						/>
						{errors.email && (
							<p className="text-sm text-red-600">{errors.email}</p>
						)}
					</div>
					<div className="grid gap-2">
						<Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
						<Input
							id="avatarUrl"
							value={avatarUrl}
							onChange={(e) => setAvatarUrl(e.target.value)}
							placeholder="https://…"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Cancel
					</Button>
					<Button onClick={handleSave}>
						{memberToEdit ? "Save changes" : "Save member"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
