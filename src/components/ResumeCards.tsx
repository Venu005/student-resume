"use client";

import { deleteResume } from "@/lib/actions/resume.actions";
import { Resume } from "@prisma/client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ResumeCards({ resumes }: { resumes: Resume[] }) {
  const router = useRouter();

  if (!resumes) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  async function handleDelete(id: string) {
    try {
      const res = await deleteResume(id);
      if (res) {
        toast.success(res.message);
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete resume");
    }
  }

  return (
    <ul className="w-full divide-y divide-gray-200 dark:divide-gray-700">
      {resumes.map((resume) => (
        <motion.div
          key={resume.id}
          className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg p-4 transition-colors">
            <div>
              <motion.h3 className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left">
                {resume.fileName}
              </motion.h3>
            </div>
          </div>

          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href={`/resume-enhancer/${resume.id}`}>
              <motion.button
                className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-blue-500 hover:text-white text-black"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Edit
              </motion.button>
            </Link>
            <motion.button
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-red-500 hover:text-white text-black"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDelete(resume.id)}
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      ))}
    </ul>
  );
}
