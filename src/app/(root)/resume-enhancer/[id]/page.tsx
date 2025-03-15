import ResumeEditor from "@/components/ResumeEditor";
import { EnhancementPanel } from "@/components/enhancement-panel";
import { getResumeById } from "@/lib/actions/resume.actions";
import { Loader2 } from "lucide-react";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  console.log(id, typeof id);
  const resume = await getResumeById(id);

  if (!resume?.resume) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 ">
      <div className="h-full min-h-0">
        <ResumeEditor resumeData={resume.resume} />
      </div>
      <div className="h-full min-h-0 pt-28">
        <EnhancementPanel resumeData={resume.resume} />
      </div>
    </div>
  );
}
