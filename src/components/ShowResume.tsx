import { Suspense } from "react";
import { getUserResume } from "@/lib/actions/resume.actions";
import { ResumeCards } from "./ResumeCards";
import { Loader2 } from "lucide-react";

async function ShowResumeContent() {
  const resumes = await getUserResume();
  return <ResumeCards resumes={resumes} />;
}

export default function ShowResume() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <ShowResumeContent />
    </Suspense>
  );
}
