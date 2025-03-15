"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "../db/prisma";

export async function getUserResume() {
  try {
    const user = await currentUser();

    if (!user) {
      throw new Error("User not found");
    }

    const clerkId = user.id;

    const resumes = await prisma.resume.findMany({
      where: {
        clerkId: clerkId,
      },
    });

    return resumes;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get user resume");
  }
}

export async function deleteResume(id: string) {
  try {
    const resume = await prisma.resume.delete({
      where: {
        id: id,
      },
    });

    return { message: "Resume deleted successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete resume");
  }
}

export async function getResumeById(id: string) {
  try {
    const resume = await prisma.resume.findUnique({
      where: { id },
    });

    if (!resume) throw new Error("Resume not found");

    // Parse the resume content with proper error handling
    const parsedResume = JSON.parse(JSON.stringify(resume.resume));

    return {
      ...resume,
      resume: parsedResume,
    };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch resume");
  }
}
