"use server";

import { currentUser } from "@clerk/nextjs/server";
import Groq from "groq-sdk";
import prisma from "../db/prisma";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function evaluateResume(formData: FormData) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("User not found");

    const clerkId = user.id;

    const resumeFile = formData.get("file") as File;

    const parseFormData = new FormData();
    parseFormData.append("file", resumeFile);

    const parseRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/parse-pdf`,
      {
        method: "POST",
        body: parseFormData,
      }
    );

    if (!parseRes.ok) throw new Error("PDF parsing failed");

    const { text, metadata } = await parseRes.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Analyze the following resume text and extract the following information in JSON format:
        {
          "contact_info": {
            "name": "[Full Name]",
            "email": "[Email Address]",
            "phone": "[Phone Number]",
            "location": "[City, State]",
            "linkedin": "[LinkedIn URL]",
            "portfolio": "[Portfolio/Website URL]"
          },
          "skills": ["list", "of", "technical", "skills"],
          "education": [
            {
              "degree": "[Degree Name]",
              "institution": "[University Name]",
              "dates": "[MM/YYYY - MM/YYYY]",
              "gpa": "[GPA]"
            }
          ],
          "experience": [
            {
              "title": "[Job Title]",
              "company": "[Company Name]",
              "dates": "[MM/YYYY - MM/YYYY]",
              "responsibilities": ["list", "of", "bullet points"]
            }
          ],
          "certifications": ["list", "of", "certifications"],
          "projects": [
            {
              "name": "[Project Name]",
              "description": "[Brief description]",
              "technologies": ["list", "of", "technologies used"]
            }
          ],
          "languages": ["list", "of", "languages"]
        }

        Follow these rules:
        1. Return null for missing fields
        2. Keep dates in MM/YYYY format
        3. Extract only verified information from the text
        4. Prioritize technical skills over soft skills
        5. Ignore irrelevant text
        6. Maintain original capitalization

        Resume Text:
        ${text}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      stream: false,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0].message.content;

    if (content) {
      const resumeJson = JSON.parse(content);
      const newResume = await prisma.resume.create({
        data: {
          clerkId,
          resume: resumeJson,
          fileName: resumeFile.name,
        },
      });

      if (newResume) {
        return JSON.stringify(newResume);
      } else {
        throw new Error("Failed to save resume information");
      }
    } else {
      throw new Error("Failed to extract resume information");
    }
  } catch (error) {
    console.error(error);
  }
}
