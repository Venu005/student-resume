import ResumeEditor from "@/components/ResumeEditor";
import { getResumeById } from "@/lib/actions/resume.actions";
import { Loader2 } from "lucide-react";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  const resume = await getResumeById(id);

  if (!resume) {
    return (
      <div>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  return resume.resume ? <ResumeEditor resumeData={resume.resume} /> : null;
}
