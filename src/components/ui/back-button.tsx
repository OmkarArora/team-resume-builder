import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useNavigate } from "react-router";

export default function BackButton() {
	const navigate = useNavigate();

	return (
		<Button variant="outline" size="sm" onClick={() => navigate(-1)}>
			<ArrowLeft className="h-4 w-4" /> Back
		</Button>
	);
}
