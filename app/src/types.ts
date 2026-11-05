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

export type Award = {
  id: string;
  title: string;
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
  awards: Award[];
};

export type TemplateId =
  | "classic"
  | "modern"
  | "compact"
  | "minimal"
  | "executive"
  | "technical"
  | "formal";
export type PaperId = "letter" | "a4";
export type DensityId = "comfortable" | "compact";
export type AccentId = "forest" | "ink" | "navy" | "plum" | "clay";

export type SectionKey =
  | "summary"
  | "skills"
  | "experience"
  | "education"
  | "certifications"
  | "awards";

export const SECTION_KEYS: SectionKey[] = [
  "summary",
  "skills",
  "experience",
  "education",
  "certifications",
  "awards",
];

export type Design = {
  template: TemplateId;
  paper: PaperId;
  density: DensityId;
  accent: AccentId;
  visible: Record<SectionKey, boolean>;
  sectionOrder: SectionKey[];
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
