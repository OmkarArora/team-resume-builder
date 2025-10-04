import { pdf } from "@react-pdf/renderer";
import ResumePDFDocument from "@/components/resume/pdf/ResumePDFDocument";
import type { Resume } from "@/lib/types";

/**
 * Function to export resume as PDF using react-pdf
 */
export const exportResumeToPDF = async (resume: Resume) => {
	try {
		// Generate PDF blob
		const blob = await pdf(<ResumePDFDocument resume={resume} />).toBlob();

		// Create download link
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${resume.fullName.replace(/\s+/g, "_")}_Resume.pdf`;

		// Trigger download
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Clean up
		URL.revokeObjectURL(url);

		return true;
	} catch (error) {
		console.error("PDF export error:", error);
		throw error;
	}
};
