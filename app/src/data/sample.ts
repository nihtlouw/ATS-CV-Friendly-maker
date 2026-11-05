import type { AppState, Certification, Education, Experience, Resume } from "@/types";

const experience: Experience[] = [
  {
    id: "exp-1",
    role: "Operations Coordinator",
    company: "Bayview Community Health",
    location: "Oakland, CA",
    start: "Mar 2021",
    end: "Present",
    bullets: [
      "Coordinate scheduling and administrative workflows for a 12-person care team, keeping appointment fill rates above 92%.",
      "Reduced monthly reporting time by 20% by building a standardized Excel tracking system adopted across 3 departments.",
      "Resolve an average of 30 patient and partner inquiries per day with a 96% satisfaction rating.",
      "Manage vendor relationships and an office budget of $180K, identifying $24K in annual savings.",
    ],
  },
  {
    id: "exp-2",
    role: "Program Assistant",
    company: "Eastside Youth Alliance",
    location: "Berkeley, CA",
    start: "Jun 2018",
    end: "Feb 2021",
    bullets: [
      "Supported logistics for 4 community programs serving 600+ residents each year.",
      "Improved volunteer onboarding by creating a 10-step checklist that cut start-up time from 5 days to 2.",
      "Compiled monthly impact reports for 8 stakeholders using Salesforce and Google Sheets.",
      "Maintained participant records and prepared materials for weekly team meetings.",
    ],
  },
];

const education: Education[] = [
  {
    id: "edu-1",
    degree: "B.A. in Sociology",
    school: "University of California, Berkeley",
    location: "Berkeley, CA",
    year: "2018",
  },
];

const certifications: Certification[] = [
  {
    id: "cert-1",
    name: "Google Project Management Certificate",
    issuer: "Google",
    year: "2023",
  },
  {
    id: "cert-2",
    name: "Nonprofit Operations Certificate",
    issuer: "Cal State East Bay",
    year: "2022",
  },
];

export const sampleResume: Resume = {
  name: "Amara Okonkwo",
  title: "Operations & Program Coordinator",
  email: "amara.okonkwo@email.com",
  phone: "(415) 555-0184",
  location: "Oakland, CA",
  linkedin: "linkedin.com/in/amaraokonkwo",
  summary:
    "Operations and program coordinator with 6+ years of experience supporting fast-growing teams in nonprofit and healthcare settings. Known for turning messy processes into clear systems, improving reporting accuracy, and coordinating cross-functional schedules for teams of 10–25. Seeking a program coordinator role where data-informed operations help more people access care.",
  skills: [
    "Program Coordination",
    "Operations Management",
    "Project Scheduling",
    "Stakeholder Communication",
    "Excel & Google Sheets",
    "Data Reporting",
    "Process Improvement",
    "Event Logistics",
    "Budget Tracking",
    "Salesforce CRM",
    "Vendor Management",
    "Cross-functional Collaboration",
  ],
  experience,
  education,
  certifications,
};

export const sampleJobDescription = `Program Coordinator — Community Health

We are hiring a Program Coordinator to support our community health programs. You will coordinate schedules, track budgets, and keep cross-functional teams aligned across multiple sites.

What you'll do:
• Own day-to-day program coordination, scheduling, and event logistics.
• Track expenses and support budgeting for a portfolio of programs.
• Build and maintain reporting dashboards in Excel and Google Sheets.
• Own process improvement for onboarding, volunteer management, and vendor management.
• Keep stakeholder communication clear across program, clinical, and finance teams.
• Use Salesforce or a similar CRM to keep participant records accurate.
• Support data analysis and share monthly outcomes with leadership.

What we're looking for:
• 3+ years of operations or project management experience.
• Strong written communication and attention to detail.
• Experience in nonprofit or healthcare settings preferred.
• Familiarity with patient care, compliance, or grants is a plus.
• PMP or project management training is a bonus.`;

export const starterResume: Resume = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  skills: [],
  experience: [
    {
      id: "exp-new",
      role: "",
      company: "",
      location: "",
      start: "",
      end: "",
      bullets: [""],
    },
  ],
  education: [],
  certifications: [],
};

export const initialState: AppState = {
  resume: sampleResume,
  design: {
    template: "modern",
    paper: "letter",
    density: "comfortable",
    visible: {
      summary: true,
      skills: true,
      experience: true,
      education: true,
      certifications: true,
    },
  },
  jobDescription: "",
};

export const defaultSkillSuggestions = [
  "Stakeholder Management",
  "Process Improvement",
  "Data Analysis",
  "Budget Management",
  "Cross-functional Collaboration",
  "Vendor Management",
  "Program Coordination",
  "Reporting & Dashboards",
];

export const sampleCvPlain = `AMARA OKONKWO
Operations & Program Coordinator
Oakland, CA | (415) 555-0184 | amara.okonkwo@email.com | linkedin.com/in/amaraokonkwo

PROFESSIONAL SUMMARY
Operations and program coordinator with 6+ years of experience supporting fast-growing teams in nonprofit and healthcare settings. Known for turning messy processes into clear systems, improving reporting accuracy, and coordinating cross-functional schedules for teams of 10–25. Seeking a program coordinator role where data-informed operations help more people access care.

CORE SKILLS
Program Coordination, Operations Management, Project Scheduling, Stakeholder Communication, Excel & Google Sheets, Data Reporting, Process Improvement, Event Logistics, Budget Tracking, Salesforce CRM, Vendor Management, Cross-functional Collaboration

WORK EXPERIENCE
Operations Coordinator | Bayview Community Health | Oakland, CA | Mar 2021 – Present
- Coordinate scheduling and administrative workflows for a 12-person care team, keeping appointment fill rates above 92%.
- Reduced monthly reporting time by 20% by building a standardized Excel tracking system adopted across 3 departments.
- Resolve an average of 30 patient and partner inquiries per day with a 96% satisfaction rating.
- Manage vendor relationships and an office budget of $180K, identifying $24K in annual savings.

Program Assistant | Eastside Youth Alliance | Berkeley, CA | Jun 2018 – Feb 2021
- Supported logistics for 4 community programs serving 600+ residents each year.
- Improved volunteer onboarding by creating a 10-step checklist that cut start-up time from 5 days to 2.
- Compiled monthly impact reports for 8 stakeholders using Salesforce and Google Sheets.
- Maintained participant records and prepared materials for weekly team meetings.

EDUCATION
B.A. in Sociology | University of California, Berkeley | Berkeley, CA | 2018

CERTIFICATIONS
Google Project Management Certificate | Google | 2023
Nonprofit Operations Certificate | Cal State East Bay | 2022`;
