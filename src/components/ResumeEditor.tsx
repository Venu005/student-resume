"use client";

import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string | null;
  linkedin: string | null;
  portfolio: string | null;
}

interface Education {
  degree: string;
  institution: string;
  dates: string;
  gpa: string | null;
}

interface Experience {
  title: string;
  company: string;
  dates: string;
  responsibilities: string[] | null;
}

interface Project {
  name: string;
  description: string;
  technologies: string[] | null;
}

interface ResumeData {
  contact_info: ContactInfo;
  skills: string[];
  education: Education[];
  experience: Experience[];
  certifications: string[] | null;
  projects: Project[];
  languages: string[] | null;
}

// JSON to Markdown converter
const jsonToMarkdown = (data: ResumeData): string => {
  let md = "";

  // Contact Information
  const { contact_info } = data;
  md += `# ${contact_info.name}\n\n`;
  md += `**Email:** ${contact_info.email}\n`;
  md += `**Phone:** ${contact_info.phone}\n`;
  if (contact_info.location) md += `**Location:** ${contact_info.location}\n`;
  if (contact_info.linkedin) md += `**LinkedIn:** ${contact_info.linkedin}\n`;
  if (contact_info.portfolio)
    md += `**Portfolio:** ${contact_info.portfolio}\n`;
  md += "\n";

  // Skills
  if (data.skills.length > 0) {
    md += "## Skills\n\n";
    data.skills.forEach((skill) => (md += `- ${skill}\n`));
    md += "\n";
  }

  // Education
  if (data.education.length > 0) {
    md += "## Education\n\n";
    data.education.forEach((edu) => {
      md += `### ${edu.degree}\n`;
      md += `**Institution:** ${edu.institution}\n`;
      md += `**Dates:** ${edu.dates}\n`;
      if (edu.gpa) md += `**GPA:** ${edu.gpa}\n`;
      md += "\n";
    });
  }

  // Experience
  if (data.experience.length > 0) {
    md += "## Experience\n\n";
    data.experience.forEach((exp) => {
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
  if (data.projects.length > 0) {
    md += "## Projects\n\n";
    data.projects.forEach((project) => {
      md += `### ${project.name}\n`;
      md += `${project.description}\n`;
      if (project.technologies?.length) {
        md += "**Technologies:**\n";
        project.technologies.forEach((tech) => (md += `- ${tech}\n`));
      }
      md += "\n";
    });
  }

  return md;
};

// React component
interface ResumeEditorProps {
  resumeData: ResumeData;
}

const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeData }) => {
  const [value, setValue] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    const initialMarkdown = jsonToMarkdown(resumeData);
    setValue(initialMarkdown);
  }, [resumeData]);

  const handleSave = async () => {
    try {
      console.log("Saving resume...", value);
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving resume");
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

      {previewMode === "edit" ? (
        <MDEditor
          value={value}
          onChange={(value) => setValue(value || "")}
          height={800}
          preview="edit"
          data-color-mode="light"
        />
      ) : (
        <div className="markdown-preview">
          <MDEditor.Markdown source={value} />
        </div>
      )}

      <div className="save-container">
        <button onClick={handleSave} className="save-button">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default ResumeEditor;
