import AddResume from "@/components/AddResume";
import ShowResume from "@/components/ShowResume";
<<<<<<< HEAD
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you're using a Button component
=======
import { Button } from "@/components/ui/button";
import Link from "next/link";
>>>>>>> bc510d223dfc1a4ad852a48b18e4c962717ba199

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col pt-24 pb-8 md:pt-32">
      <div className="container max-w-4xl mx-auto px-4 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Your List of Resumes
          </h1>
          <div className="flex gap-4">
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white hover:cursor-pointer"
            >
              <Link href="/career-guidance">Career Guidance</Link>
            </Button>
<<<<<<< HEAD

=======
>>>>>>> bc510d223dfc1a4ad852a48b18e4c962717ba199
            <AddResume />
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Resume List Section */}
=======
>>>>>>> bc510d223dfc1a4ad852a48b18e4c962717ba199
      <div className="container max-w-4xl mx-auto px-4 flex-1">
        <ShowResume />
      </div>
    </div>
  );
}
