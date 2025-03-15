import { getUserResume } from "@/lib/actions/resume.actions";
import { ResumeCards } from "./ResumeCards";
import { Loader2 } from "lucide-react";

export default async function ShowResume() {
  const resumes = await getUserResume();
  if (!resumes) {
    return (
      <div>
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  return <ResumeCards resumes={resumes} />;
}
