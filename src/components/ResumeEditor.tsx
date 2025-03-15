"use client";
import { useState, useEffect, useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import { z } from "zod";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ResumeDataSchema = z
  .object({
    contact_info: z.object({
      name: z.string(),
      email: z.string().email(),
      phone: z.string(),
      location: z.string().nullable().optional().default(""),
      linkedin: z.string().nullable().optional().default(""),
      portfolio: z.string().nullable().optional().default(""),
    }),
    skills: z.array(z.string()).nullable().default([]),
    education: z
      .array(
        z.object({
          degree: z.string(),
          institution: z.string(),
          dates: z.string(),
          gpa: z.string().nullable().optional().default(""),
        })
      )
      .nullable()
      .default([]),
    experience: z
      .array(
        z.object({
          title: z.string(),
          company: z.string(),
          dates: z.string(),
          responsibilities: z
            .array(z.string())
            .nullable()
            .optional()
            .default([]),
        })
      )
      .nullable()
      .default([]),
    certifications: z.array(z.string()).nullable().optional().default([]),
    projects: z
      .array(
        z.object({
          name: z.string(),
          description: z.array(z.string()).nullable().optional().default([]),
          technologies: z.array(z.string()).nullable().optional().default([]),
        })
      )
      .nullable()
      .default([]),
    languages: z.array(z.string()).nullable().optional().default([]),
  })
  .transform((data) => ({
    // Transform null arrays to empty arrays
    ...data,
    skills: data.skills || [],
    education: data.education || [],
    experience: data.experience || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    languages: data.languages || [],
  }));

type ResumeData = z.infer<typeof ResumeDataSchema>;

// Updated JSON to Markdown converter with null checks
const jsonToMarkdown = (data: unknown): string => {
  const parseResult = ResumeDataSchema.safeParse(data);

  if (!parseResult.success) {
    console.error("Invalid resume data:", parseResult.error);
    return "# Invalid Resume Format";
  }

  const validData = parseResult.data;
  let md = "";

  // Contact Information
  const { contact_info } = validData;
  md += `# ${contact_info.name}\n\n`;
  md += `**Email:** ${contact_info.email}\n`;
  md += `**Phone:** ${contact_info.phone}\n`;
  if (contact_info.location) md += `**Location:** ${contact_info.location}\n`;
  if (contact_info.linkedin) md += `**LinkedIn:** ${contact_info.linkedin}\n`;
  if (contact_info.portfolio)
    md += `**Portfolio:** ${contact_info.portfolio}\n`;
  md += "\n";

  // Skills
  if (validData.skills?.length) {
    md += "## Skills\n\n";
    validData.skills.forEach((skill) => (md += `- ${skill}\n`));
    md += "\n";
  }

  // Education
  if (validData.education?.length) {
    md += "## Education\n\n";
    validData.education.forEach((edu) => {
      md += `### ${edu.degree}\n`;
      md += `**Institution:** ${edu.institution}\n`;
      md += `**Dates:** ${edu.dates}\n`;
      if (edu.gpa) md += `**GPA:** ${edu.gpa}\n`;
      md += "\n";
    });
  }

  // Experience
  if (validData.experience?.length) {
    md += "## Experience\n\n";
    validData.experience.forEach((exp) => {
      md += `### ${exp.title}\n`;
      md += `**Company:** ${exp.company}\n`;
      md += `**Dates:** ${exp.dates}\n`;
      if (exp.responsibilities?.length) {
        md += "**Responsibilities:**\n";
        exp.responsibilities.forEach((resp) => (md += `- ${resp}\n`));
      }
      md += "\n";
    });
  }

  // Projects
  if (validData.projects?.length) {
    md += "## Projects\n\n";
    validData.projects.forEach((project) => {
      md += `### ${project.name}\n`;

      // Add description bullets
      if (project.description?.length) {
        project.description.forEach((desc) => (md += `- ${desc}\n`));
      }

      // Add technologies
      if (project.technologies?.length) {
        md += "\n**Technologies:**\n";
        project.technologies.forEach((tech) => (md += `- ${tech}\n`));
      }
      md += "\n";
    });
  }

  return md;
};

// Updated component with validation
interface ResumeEditorProps {
  resumeData: unknown;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeData }) => {
  const [value, setValue] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const initialMarkdown = jsonToMarkdown(resumeData);
      setValue(initialMarkdown);
    } catch (error) {
      console.error("Error initializing editor:", error);
      setValue("# Error loading resume data");
    }
  }, [resumeData]);

  const handleSave = async () => {
    try {
      console.log("Saving resume...", value);
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving resume");
    }
  };

  // Update the handleDownload function with these changes
  const handleDownload = async () => {
    if (!previewRef.current || isDownloading) return;

    try {
      setIsDownloading(true);

      // Ensure preview mode is active
      setPreviewMode("preview");

      // Add slight delay for DOM update
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(previewRef.current, {
        scale: 2, // Increase resolution
        logging: true, // Enable logging
        useCORS: true, // Handle external resources
        windowWidth: previewRef.current.scrollWidth,
        windowHeight: previewRef.current.scrollHeight,
      });
      console.log(canvas);
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const ratio = pageWidth / canvas.width;
      const imgHeight = canvas.height * ratio;
      console.log(imgData);
      // Add image with proper scaling
      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);

      // Add new page if content overflows
      if (imgHeight > pageHeight) {
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -pageHeight, pageWidth, imgHeight);
      }

      pdf.save("resume.pdf");
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Error generating PDF`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="resume-editor-container">
      <div className="mode-toggle">
        <button
          onClick={() => setPreviewMode("edit")}
          className={previewMode === "edit" ? "active" : ""}
        >
          Edit Mode
        </button>
        <button
          onClick={() => setPreviewMode("preview")}
          className={previewMode === "preview" ? "active" : ""}
        >
          Preview Mode
        </button>
      </div>

      {previewMode === "preview" ? (
        <div className="markdown-preview" ref={previewRef}>
          <MDEditor.Markdown
            source={value}
            style={{
              padding: "1rem",
              border: "1px solid #e2e8f0",
              borderRadius: "0.5rem",
              backgroundColor: "white",
              color: "black",
            }}
          />
        </div>
      ) : (
        <MDEditor
          value={value}
          onChange={(value) => setValue(value || "")}
          height={800}
          preview="edit"
          data-color-mode="light"
        />
      )}

      <div className="save-container">
        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>
        <button
          onClick={() => {
            console.log("clicking")
            handleDownload().catch((error) =>
              console.error("Download error:", error)
            );
          }}
          disabled={isDownloading}
          className="download-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isDownloading ? "Generating PDF..." : "Download PDF"}
        </button>
      </div>
    </div>
  );
};

export default ResumeEditor;
