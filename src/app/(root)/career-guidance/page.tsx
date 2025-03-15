import { CareerGuidance } from "@/components/CareerGuidance";
import Link from "next/link";
<<<<<<< HEAD
import { Button } from "@/components/ui/button"; // Assuming you're using a Button component
=======
import { Button } from "@/components/ui/button";
>>>>>>> bc510d223dfc1a4ad852a48b18e4c962717ba199

export default function CareerPage() {
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">AI Career Advisor</h1>
        <Button asChild className="cursor-pointer">
          <Link href="/resume-enhancer">Go to Resume Enhancer</Link>
        </Button>
      </div>
      <CareerGuidance />
    </div>
  );
}
