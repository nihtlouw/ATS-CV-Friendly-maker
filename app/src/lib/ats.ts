import type { AtsCheck, Design, Keyword, Resume, SectionKey } from "@/types";

export const PAPER_SIZES = {
  letter: { width: 816, height: 1056, label: "US Letter", print: "letter" },
  a4: { width: 794, height: 1123, label: "A4", print: "A4" },
} as const;

export const FONTS: Record<import("@/types").FontId, { label: string; stack: string }> = {
  arial: { label: "Arial", stack: "Arial, Helvetica, 'Liberation Sans', sans-serif" },
  segoe: { label: "Segoe UI", stack: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif" },
  calibri: { label: "Calibri", stack: "Calibri, Carlito, 'Segoe UI', Arial, sans-serif" },
  georgia: { label: "Georgia", stack: "Georgia, 'Times New Roman', Times, serif" },
};

export const ACCENTS: Record<import("@/types").AccentId, { label: string; hex: string }> = {
  forest: { label: "Forest", hex: "#1b4b39" },
  ink: { label: "Ink", hex: "#1f2937" },
  navy: { label: "Navy", hex: "#1e3a5f" },
  plum: { label: "Plum", hex: "#5b2a4a" },
  clay: { label: "Clay", hex: "#a64d31" },
};

export const uid = () => Math.random().toString(36).slice(2, 9);

/** Removes **bold** / *italic* markers so plain-text export and keyword search stay clean. */
export const stripInlineMarkers = (value: string) =>
  value.replace(/\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*|_([^_]+)_/g, "$1$2$3$4");

export const wordCount = (value: string) =>
  value.trim() ? value.trim().split(/\s+/).length : 0;

export const countSentences = (value: string) =>
  value
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 2).length;

const STOP_WORDS = new Set(
  `a an and are as at be been being but by can could do does doing for from had has have having he her here hers him his how i if in into is it its itself just me more most my no nor not of off on once only or other our ours out over own same she should so some such than that the their theirs them then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours role roles job jobs work working experience experienced candidate candidates ideal preferred plus preferred strong ability able across within team teams people person well using use used ensure support supporting help helping including include includes new company companies position applicant applicants looking lookingfor hire hiring full time part applicants please apply benefits salary equal opportunity employer`
    .split(/\s+/)
    .filter(Boolean),
);

const ACRONYMS = new Set(["crm", "pmp", "sql", "api", "erp", "hr", "it", "ui", "ux", "seo", "kpi", "emr", "ehr", "ai", "qa", "aws", "html", "css"]);

const SKILL_LEXICON = [
  "program coordination",
  "project coordination",
  "project management",
  "program management",
  "operations management",
  "operations",
  "scheduling",
  "administrative support",
  "calendar management",
  "event planning",
  "event logistics",
  "budgeting",
  "budget tracking",
  "grant writing",
  "grants",
  "compliance",
  "onboarding",
  "volunteer management",
  "vendor management",
  "stakeholder communication",
  "stakeholder management",
  "written communication",
  "verbal communication",
  "cross-functional",
  "process improvement",
  "data analysis",
  "data reporting",
  "reporting",
  "dashboards",
  "excel",
  "google sheets",
  "salesforce",
  "hubspot",
  "notion",
  "asana",
  "jira",
  "trello",
  "quickbooks",
  "powerpoint",
  "patient care",
  "patient scheduling",
  "medical records",
  "healthcare",
  "nonprofit",
  "customer service",
  "account management",
  "client relations",
  "office management",
  "team leadership",
  "training",
  "facilitation",
  "recruitment",
  "payroll",
  "bookkeeping",
  "invoicing",
  "marketing",
  "content marketing",
  "social media",
  "email marketing",
  "brand strategy",
  "copywriting",
  "graphic design",
  "figma",
  "canva",
  "adobe creative suite",
  "wordpress",
  "google analytics",
  "data visualization",
  "tableau",
  "power bi",
  "python",
  "javascript",
  "typescript",
  "react",
  "node.js",
  "agile",
  "scrum",
  "product management",
  "roadmap",
  "user research",
  "quality assurance",
  "machine learning",
  "attention to detail",
  "problem solving",
  "time management",
  "negotiation",
  "inventory management",
  "supply chain",
  "logistics",
  "food safety",
  "insurance verification",
  "billing",
  "curriculum development",
  "lesson planning",
  "program evaluation",
  "impact measurement",
  "fundraising",
  "donor relations",
  "community outreach",
  "partnership development",
  "public health",
  "case management",
  "mental health",
];

const TITLE_MINOR_WORDS = new Set(["and", "of", "in", "for", "the", "to", "a", "an", "&"]);

const titleCase = (term: string) =>
  term
    .split(" ")
    .map((word, index) => {
      const clean = word.toLowerCase();
      if (ACRONYMS.has(clean)) return clean.toUpperCase();
      if (index > 0 && TITLE_MINOR_WORDS.has(clean)) return clean;
      return clean.charAt(0).toUpperCase() + clean.slice(1);
    })
    .join(" ");

export function extractKeywords(jobDescription: string): string[] {
  if (!jobDescription.trim()) return [];

  const lower = ` ${jobDescription.toLowerCase().replace(/[•·]/g, " ").replace(/\s+/g, " ")} `;
  const found: string[] = [];

  for (const skill of SKILL_LEXICON) {
    if (lower.includes(` ${skill} `) || lower.includes(`${skill},`) || lower.includes(`${skill}.`)) {
      found.push(titleCase(skill));
    }
  }

  const tokens = lower.match(/[a-z][a-z+#./-]{3,}/g) ?? [];
  const counts = new Map<string, number>();
  for (const token of tokens) {
    const clean = token.replace(/[./-]+$/, "");
    if (clean.length < 4 || STOP_WORDS.has(clean)) continue;
    if (SKILL_LEXICON.some((skill) => skill.includes(clean) && skill !== clean)) continue;
    counts.set(clean, (counts.get(clean) ?? 0) + 1);
  }

  const frequent = [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([word]) => titleCase(word));

  const seen = new Set(found.map((term) => term.toLowerCase()));
  for (const term of frequent) {
    if (found.length >= 20) break;
    if (seen.has(term.toLowerCase())) continue;
    seen.add(term.toLowerCase());
    found.push(term);
  }

  return found.slice(0, 20);
}

const normalise = (value: string) =>
  ` ${value.toLowerCase().replace(/[•·]/g, " ").replace(/\s+/g, " ")} `;

export function resumeSearchText(resume: Resume): string {
  return normalise(stripInlineMarkers(
    [
      resume.name,
      resume.title,
      resume.summary,
      resume.skills.join(", "),
      ...(resume.softSkills ?? []),
      ...resume.experience.flatMap((entry) => [
        entry.role,
        entry.company,
        entry.location,
        ...entry.bullets,
      ]),
      ...resume.education.flatMap((entry) => [entry.degree, entry.school]),
      ...resume.certifications.flatMap((entry) => [entry.name, entry.issuer]),
      ...(resume.awards ?? []).flatMap((entry) => [entry.title, entry.issuer]),
    ].join(" ")),
  );
}

export function getKeywords(jobDescription: string, resume: Resume): Keyword[] {
  const text = resumeSearchText(resume);
  return extractKeywords(jobDescription).map((term) => {
    const needle = normalise(term).trim();
    return { term, matched: text.includes(` ${needle} `) || text.includes(needle) };
  });
}

const clampPoints = (value: number, max: number) => Math.max(0, Math.min(max, Math.round(value)));

export function analyzeResume(resume: Resume, jobDescription: string) {
  const contactFields = [resume.email, resume.phone, resume.location, resume.linkedin].filter(
    (value) => value.trim().length > 0,
  );
  const contactEarned = clampPoints((15 * contactFields.length) / 4, 15);

  const headlineWords = resume.title.trim() ? resume.title.trim().split(/\s+/).length : 0;
  const headlineEarned = headlineWords >= 2 ? 5 : headlineWords === 1 ? 3 : 0;

  const sentences = countSentences(resume.summary);
  const summaryLength = resume.summary.trim().length;
  const summaryEarned =
    summaryLength >= 160 && sentences >= 2 && sentences <= 4
      ? 10
      : summaryLength > 40
        ? 6
        : 0;

  const skillEarned = clampPoints((15 * Math.min(resume.skills.length, 8)) / 8, 15);

  const roles = resume.experience.filter(
    (entry) => entry.role.trim() || entry.company.trim(),
  );
  const rolesWithDates = roles.filter(
    (entry) => (entry.start.trim() || entry.end.trim()) && entry.bullets.some((bullet) => bullet.trim()),
  ).length;
  const experienceEarned = clampPoints((20 * Math.min(rolesWithDates, 2)) / 2, 20);

  const allBullets = resume.experience.flatMap((entry) => entry.bullets).filter((b) => b.trim());
  const quantified = allBullets.filter((bullet) => /\d/.test(bullet)).length;
  const quantifiedEarned = allBullets.length
    ? clampPoints((15 * Math.min(quantified / allBullets.length, 0.6)) / 0.6, 15)
    : 0;

  const educationEarned = resume.education.some((entry) => entry.school.trim() || entry.degree.trim())
    ? 10
    : 0;

  const keywords = getKeywords(jobDescription, resume);
  const matchedKeywords = keywords.filter((keyword) => keyword.matched).length;
  const keywordEarned = jobDescription.trim()
    ? keywords.length
      ? clampPoints((5 * matchedKeywords) / keywords.length, 5)
      : 3
    : 0;

  const formattingEarned = 5;

  const checks: AtsCheck[] = [
    {
      id: "contact",
      label: "Contact details",
      detail:
        contactFields.length === 4
          ? "Email, phone, location and LinkedIn are all present in plain text."
          : `Add ${4 - contactFields.length} more contact ${4 - contactFields.length === 1 ? "detail" : "details"} so a recruiter can reach you.`,
      status: contactFields.length === 4 ? "pass" : contactFields.length > 0 ? "warn" : "todo",
      earned: contactEarned,
      max: 15,
      hint: "Use a real email address, not a placeholder, and skip photos.",
    },
    {
      id: "headline",
      label: "Target job title",
      detail: headlineWords >= 2
        ? "A clear target title sits directly under your name."
        : "Add the role you are targeting directly under your name.",
      status: headlineEarned === 5 ? "pass" : headlineEarned > 0 ? "warn" : "todo",
      earned: headlineEarned,
      max: 5,
      hint: "Mirror the exact job title from the posting where it is honest to do so.",
    },
    {
      id: "summary",
      label: "Professional summary",
      detail:
        summaryEarned === 10
          ? `${sentences} sentences that name your experience, strengths and target role.`
          : "Aim for two or three sentences covering your experience, strengths and target role.",
      status: summaryEarned === 10 ? "pass" : summaryEarned > 0 ? "warn" : "todo",
      earned: summaryEarned,
      max: 10,
      hint: "Skip first-person pronouns. Start with your role and years of experience.",
    },
    {
      id: "skills",
      label: "Relevant skills",
      detail:
        resume.skills.length >= 8
          ? `${resume.skills.length} skills listed, ready for keyword matching.`
          : `List at least 8 skills that appear in the job posting. You have ${resume.skills.length}.`,
      status: resume.skills.length >= 8 ? "pass" : resume.skills.length > 0 ? "warn" : "todo",
      earned: skillEarned,
      max: 15,
      hint: "Prefer concrete skills and tools over soft adjectives.",
    },
    {
      id: "experience",
      label: "Work experience",
      detail:
        rolesWithDates >= 2
          ? `${rolesWithDates} roles with dates and achievement-focused bullets.`
          : "Add a role with dates and at least one achievement bullet.",
      status: rolesWithDates >= 2 ? "pass" : rolesWithDates > 0 ? "warn" : "todo",
      earned: experienceEarned,
      max: 20,
      hint: "Format dates consistently, for example “Mar 2021 – Present”.",
    },
    {
      id: "impact",
      label: "Quantified achievements",
      detail: allBullets.length
        ? `${quantified} of ${allBullets.length} bullets include a measurable number.`
        : "Write achievement bullets with a measurable result.",
      status:
        allBullets.length && quantified / allBullets.length >= 0.6
          ? "pass"
          : quantified > 0
            ? "warn"
            : "todo",
      earned: quantifiedEarned,
      max: 15,
      hint: "Use %, $, volume, time saved, or team size — only when the number is accurate.",
    },
    {
      id: "education",
      label: "Education",
      detail: resume.education.some((entry) => entry.school.trim())
        ? "Education is listed with the school and graduation year."
        : "Add your credential, school and graduation year.",
      status: educationEarned === 10 ? "pass" : resume.education.length ? "warn" : "todo",
      earned: educationEarned,
      max: 10,
      hint: "Keep it to credential, institution, location and year.",
    },
    {
      id: "keywords",
      label: "Job-description keywords",
      detail: jobDescription.trim()
        ? keywords.length
          ? `${matchedKeywords} of ${keywords.length} relevant keywords from the posting appear in your CV.`
          : "We could not find distinctive keywords. Add a little more detail to the posting."
        : "Paste a job description in the Job match tab to check keyword coverage.",
      status: jobDescription.trim()
        ? keywordEarned >= 4
          ? "pass"
          : keywordEarned > 0
            ? "warn"
            : "todo"
        : "todo",
      earned: keywordEarned,
      max: 5,
      hint: "Mirror the posting's language only where it truthfully describes your work.",
    },
    {
      id: "format",
      label: "ATS-safe formatting",
      detail:
        "Single column, standard headings, no tables, text boxes, icons or graphics.",
      status: "pass",
      earned: formattingEarned,
      max: 5,
      hint: "Export a text-based PDF, then check that you can select the text.",
    },
  ];

  const score = checks.reduce((sum, check) => sum + check.earned, 0);
  const improvements = checks.filter((check) => check.earned < check.max);
  const nextAction = improvements[0];

  return {
    score,
    checks,
    improvements,
    nextAction,
    keywords,
    matchedKeywords,
    label:
      score >= 90 ? "ATS-ready" : score >= 75 ? "Nearly there" : score >= 55 ? "Getting there" : "Needs a tune-up",
  };
}

export function suggestionPool(resume: Resume, jobDescription: string): string[] {
  const existing = new Set(resume.skills.map((skill) => skill.toLowerCase()));
  const fromJob = getKeywords(jobDescription, resume)
    .filter((keyword) => !keyword.matched)
    .map((keyword) => keyword.term);
  const fallback = [
    "Stakeholder Management",
    "Process Improvement",
    "Data Analysis",
    "Budget Management",
    "Cross-functional Collaboration",
    "Vendor Management",
    "Program Coordination",
    "Reporting & Dashboards",
  ];
  const pool = [...fromJob, ...fallback];
  const seen = new Set<string>();
  return pool.filter((skill) => {
    const key = skill.toLowerCase();
    if (existing.has(key) || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 6);
}

export function buildPlainText(resume: Resume, design: Design): string {
  const contact = [resume.location, resume.phone, resume.email, resume.linkedin]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" | ");

  const builders: Record<SectionKey, () => string | null> = {
    summary: () =>
      resume.summary.trim() ? `PROFESSIONAL SUMMARY\n${stripInlineMarkers(resume.summary.trim())}` : null,
    skills: () =>
      resume.skills.length ? `CORE SKILLS\n${resume.skills.join(", ")}` : null,
    softSkills: () =>
      (resume.softSkills ?? []).length
        ? `SOFT SKILLS\n${stripInlineMarkers((resume.softSkills ?? []).join(", "))}`
        : null,
    experience: () => {
      const jobs = resume.experience
        .filter((job) => job.role.trim() || job.company.trim())
        .map((job) => {
          const header = [job.role, job.company, job.location, [job.start, job.end].filter(Boolean).join(" \u2013 ")]
            .map((value) => value.trim())
            .filter(Boolean)
            .join(" | ");
          const bullets = job.bullets
            .map((bullet) => stripInlineMarkers(bullet.trim()))
            .filter(Boolean)
            .map((bullet) => `- ${bullet}`)
            .join("\n");
          return [header, bullets].filter(Boolean).join("\n");
        })
        .filter(Boolean);
      return jobs.length ? `WORK EXPERIENCE\n${jobs.join("\n\n")}` : null;
    },
    education: () => {
      const entries = resume.education
        .map((entry) => [entry.degree, entry.school, entry.location, entry.year].map((v) => v.trim()).filter(Boolean).join(" | "))
        .filter(Boolean);
      return entries.length ? `EDUCATION\n${entries.join("\n")}` : null;
    },
    certifications: () => {
      const entries = resume.certifications
        .map((entry) => [entry.name, entry.issuer, entry.year].map((v) => v.trim()).filter(Boolean).join(" | "))
        .filter(Boolean);
      return entries.length ? `CERTIFICATIONS\n${entries.join("\n")}` : null;
    },
    awards: () => {
      const entries = (resume.awards ?? [])
        .map((entry) => [entry.title, entry.issuer, entry.year].map((v) => v.trim()).filter(Boolean).join(" | "))
        .filter(Boolean);
      return entries.length ? `AWARDS\n${entries.join("\n")}` : null;
    },
  };

  const order: SectionKey[] = design.sectionOrder?.length
    ? design.sectionOrder
    : ["summary", "skills", "softSkills", "experience", "education", "certifications", "awards"];
  const sections = order
    .filter((key) => design.visible[key] !== false)
    .map((key) => builders[key]?.())
    .filter((section): section is string => Boolean(section));

  const header = [resume.name.trim().toUpperCase() || "YOUR NAME", resume.title.trim(), contact]
    .filter(Boolean)
    .join("\n");
  return `${header}\n\n${sections.join("\n\n")}`.trim();
}
