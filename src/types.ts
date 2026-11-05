export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export type Education = {
  id: string;
  degree: string;
  school: string;
  location: string;
  year: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
};

export type Resume = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
};

export type TemplateId = "classic" | "modern" | "compact";
export type PaperId = "letter" | "a4";
export type DensityId = "comfortable" | "compact";

export type SectionKey = "summary" | "skills" | "experience" | "education" | "certifications";

export type Design = {
  template: TemplateId;
  paper: PaperId;
  density: DensityId;
  visible: Record<SectionKey, boolean>;
};

export type AppState = {
  resume: Resume;
  design: Design;
  jobDescription: string;
};

export type JumpTarget = {
  section: "contact" | SectionKey | "jobmatch" | "design";
  nonce: number;
} | null;

export type CheckStatus = "pass" | "todo" | "warn";

export type AtsCheck = {
  id: string;
  label: string;
  detail: string;
  status: CheckStatus;
  earned: number;
  max: number;
  hint?: string;
};

export type Keyword = {
  term: string;
  matched: boolean;
};
