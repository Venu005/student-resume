import { z } from "zod";

export const careerSchema = z.object({
  academicPerformance: z.string().min(1, "Academic info required"),
  interests: z.string().min(1, "Interests required"),
  skills: z.string().min(1, "Skills required"),
  experience: z.string().optional(),
});
