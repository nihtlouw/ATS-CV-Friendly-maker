import { useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  Copy,
  Lightbulb,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { Award, Certification, Education, Experience, Resume, SectionKey } from "@/types";
import { countSentences, suggestionPool, uid, wordCount } from "@/lib/ats";
import { Accordion, Chip, Field, TextArea } from "@/components/ui";
import { cn } from "@/utils/cn";

type OpenKey = "contact" | SectionKey;

function Tip({ children, icon = "lightbulb" }: { children: ReactNode; icon?: "lightbulb" | "sparkles" }) {
  const Icon = icon === "sparkles" ? Sparkles : Lightbulb;
  return (
    <div className="flex items-start gap-2 rounded-lg border border-line-soft bg-paper/60 px-2.5 py-2 text-[10.5px] leading-[1.5] text-[#627067]">
      <Icon className="mt-[1px] h-3 w-3 shrink-0 text-clay" />
      <p>{children}</p>
    </div>
  );
}

function EmptyAdd({
  label,
  onClick,
  icon: Icon = Plus,
}: {
  label: string;
  onClick: () => void;
  icon?: typeof Plus;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#cec7b7] bg-paper/30 px-3 py-2.5 text-[11.5px] font-medium text-forest transition hover:border-forest/35 hover:bg-lime-soft/40"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export function ContentPanel({
  resume,
  setResume,
  open,
  setOpen,
  jobDescription,
  onToast,
}: {
  resume: Resume;
  setResume: Dispatch<SetStateAction<Resume>>;
  open: OpenKey;
  setOpen: (key: OpenKey) => void;
  jobDescription: string;
  onToast: (message: string) => void;
}) {
  const [skillInput, setSkillInput] = useState("");

  const patchResume = (patch: Partial<Resume>) => setResume((prev) => ({ ...prev, ...patch }));

  const contactFilled = [resume.name, resume.email, resume.phone, resume.location, resume.linkedin].filter(
    (value) => value.trim(),
  ).length;
  const contactComplete = contactFilled === 5 && Boolean(resume.title.trim());

  const summarySentences = countSentences(resume.summary);
  const summaryComplete =
    resume.summary.trim().length >= 160 && summarySentences >= 2 && summarySentences <= 4;

  const suggestions = suggestionPool(resume, jobDescription);

  const addSkill = (raw: string) => {
    const clean = raw.trim().replace(/,$/, "");
    if (!clean) return;
    if (resume.skills.some((skill) => skill.toLowerCase() === clean.toLowerCase())) {
      onToast(`“${clean}” is already in your skills.`);
      return;
    }
    patchResume({ skills: [...resume.skills, clean] });
    setSkillInput("");
  };

  const addJob = () => {
    const next: Experience = {
      id: uid(),
      role: "",
      company: "",
      location: "",
      start: "",
      end: "",
      bullets: [""],
    };
    patchResume({ experience: [...resume.experience, next] });
  };

  const updateJob = (id: string, patch: Partial<Experience>) =>
    patchResume({
      experience: resume.experience.map((job) => (job.id === id ? { ...job, ...patch } : job)),
    });

  const removeJob = (id: string) =>
    patchResume({ experience: resume.experience.filter((job) => job.id !== id) });

  const addBullet = (id: string) =>
    patchResume({
      experience: resume.experience.map((job) =>
        job.id === id ? { ...job, bullets: [...job.bullets, ""] } : job,
      ),
    });

  const updateBullet = (id: string, index: number, value: string) =>
    patchResume({
      experience: resume.experience.map((job) =>
        job.id === id
          ? { ...job, bullets: job.bullets.map((bullet, i) => (i === index ? value : bullet)) }
          : job,
      ),
    });

  const removeBullet = (id: string, index: number) =>
    patchResume({
      experience: resume.experience.map((job) =>
        job.id === id
          ? { ...job, bullets: job.bullets.filter((_, i) => i !== index) }
          : job,
      ),
    });

  const addEducation = () =>
    patchResume({
      education: [
        ...resume.education,
        { id: uid(), degree: "", school: "", location: "", year: "" },
      ],
    });

  const updateEducation = (id: string, patch: Partial<Education>) =>
    patchResume({
      education: resume.education.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });

  const addCertification = () =>
    patchResume({
      certifications: [...resume.certifications, { id: uid(), name: "", issuer: "", year: "" }],
    });

  const updateCertification = (id: string, patch: Partial<Certification>) =>
    patchResume({
      certifications: resume.certifications.map((entry) =>
        entry.id === id ? { ...entry, ...patch } : entry,
      ),
    });

  const addAward = () =>
    patchResume({
      awards: [...(resume.awards ?? []), { id: uid(), title: "", issuer: "", year: "" }],
    });

  const updateAward = (id: string, patch: Partial<Award>) =>
    patchResume({
      awards: (resume.awards ?? []).map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    });

  const removeAward = (id: string) =>
    patchResume({ awards: (resume.awards ?? []).filter((entry) => entry.id !== id) });

  const bulletCount = resume.experience.reduce(
    (total, job) => total + job.bullets.filter((bullet) => bullet.trim()).length,
    0,
  );

  const formula =
    "[Role] with [X]+ years of experience in [field]. Known for [signature strength], [proof point], and [second strength]. Seeking a [target role] where [what you want to improve].";

  return (
    <div>
      <Accordion
        number="01"
        title="Contact details"
        meta={
          contactFilled === 5
            ? "Name, email, phone, location, LinkedIn"
            : `${contactFilled} of 5 contact details added`
        }
        complete={contactComplete}
        open={open === "contact"}
        onToggle={() => setOpen("contact")}
      >
        <div className="space-y-2.5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Field
              label="Full name"
              value={resume.name}
              onChange={(value) => patchResume({ name: value })}
              placeholder="Amara Okonkwo"
              autoComplete="name"
            />
            <Field
              label="Target role"
              value={resume.title}
              onChange={(value) => patchResume({ title: value })}
              placeholder="Operations & Program Coordinator"
            />
            <Field
              label="Email"
              type="email"
              value={resume.email}
              onChange={(value) => patchResume({ email: value })}
              placeholder="you@email.com"
              autoComplete="email"
            />
            <Field
              label="Phone"
              type="tel"
              value={resume.phone}
              onChange={(value) => patchResume({ phone: value })}
              placeholder="(415) 555-0184"
              autoComplete="tel"
            />
            <Field
              label="Location"
              value={resume.location}
              onChange={(value) => patchResume({ location: value })}
              placeholder="Oakland, CA"
              autoComplete="address-level2"
            />
            <Field
              label="LinkedIn"
              value={resume.linkedin}
              onChange={(value) => patchResume({ linkedin: value })}
              placeholder="linkedin.com/in/yourname"
            />
          </div>
          <Tip>
            Write links as plain text, not buttons. Skip your photo, date of birth, or marital status —
            none of it helps an ATS.
          </Tip>
        </div>
      </Accordion>

      <Accordion
        number="02"
        title="Professional summary"
        meta={
          resume.summary.trim()
            ? `${wordCount(resume.summary)} words · ${summarySentences} sentence${summarySentences === 1 ? "" : "s"}`
            : "2–3 sentences · not started"
        }
        complete={summaryComplete}
        open={open === "summary"}
        onToggle={() => setOpen("summary")}
      >
        <div className="space-y-2.5">
          <TextArea
            label="Summary"
            value={resume.summary}
            onChange={(value) => patchResume({ summary: value })}
            rows={5}
            placeholder="Operations coordinator with 5+ years... Known for... Seeking a..."
          />
          <div className="flex items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-wide text-[#8b978d]">
            <span>
              {resume.summary.trim().length} characters ·{" "}
              {summarySentences} sentence{summarySentences === 1 ? "" : "s"}
            </span>
            <span
              className={cn(
                "inline-flex items-center gap-1",
                summaryComplete ? "text-forest" : "text-[#9a7748]",
              )}
            >
              <span
                className={cn(
                  "h-1 w-1 rounded-full",
                  summaryComplete ? "bg-forest" : "bg-[#b78b52]",
                )}
              />
              {summaryComplete ? "On target" : "Aim for 2–3"}
            </span>
          </div>
          <div className="rounded-lg border border-line-soft bg-cream/70 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="microlabel text-[8.5px]">Proven formula</span>
              <button
                type="button"
                className="inline-flex items-center gap-1 font-mono text-[8.5px] uppercase tracking-wide text-forest hover:underline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(formula);
                    onToast("Summary formula copied to clipboard.");
                  } catch {
                    onToast("Select the formula text and copy it manually.");
                  }
                }}
              >
                <Copy className="h-2.5 w-2.5" />
                Copy
              </button>
            </div>
            <p className="mt-1.5 text-[10.5px] leading-[1.6] text-[#68756c]">{formula}</p>
          </div>
          <Tip icon="sparkles">
            Name the role you want, your years of experience, and one strength you can prove with a
            number. Skip “hard-working team player”.
          </Tip>
        </div>
      </Accordion>

      <Accordion
        number="03"
        title="Key skills"
        meta={`${resume.skills.length} skills · aim for 8–15 hard skills`}
        complete={resume.skills.length >= 8}
        open={open === "skills"}
        onToggle={() => setOpen("skills")}
      >
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((skill) => (
              <Chip
                key={skill}
                onRemove={() =>
                  patchResume({ skills: resume.skills.filter((item) => item !== skill) })
                }
              >
                {skill}
              </Chip>
            ))}
            {resume.skills.length === 0 && (
              <p className="text-[11.5px] italic text-[#98a298]">No skills added yet.</p>
            )}
          </div>
          <form
            className="flex gap-1.5"
            onSubmit={(event) => {
              event.preventDefault();
              addSkill(skillInput);
            }}
          >
            <input
              className="field"
              value={skillInput}
              onChange={(event) => {
                const value = event.target.value;
                if (value.endsWith(",")) addSkill(value);
                else setSkillInput(value);
              }}
              placeholder="Add a skill and press Enter"
              aria-label="Add a skill"
            />
            <button type="submit" className="btn-primary shrink-0 !px-3" aria-label="Add skill">
              <Plus className="h-4 w-4" />
            </button>
          </form>
          {suggestions.length > 0 && (
            <div>
              <p className="microlabel mb-1.5 text-[8.5px]">
                {jobDescription.trim() ? "Missing from the job post" : "Suggested skills"}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((suggestion) => (
                  <Chip
                    key={suggestion}
                    variant="missing"
                    onClick={() => addSkill(suggestion)}
                    title={`Add ${suggestion}`}
                  >
                    <span className="mr-0.5 inline-flex items-center">
                      <Plus className="h-2.5 w-2.5" />
                    </span>
                    {suggestion}
                  </Chip>
                ))}
              </div>
            </div>
          )}
          <Tip>
            Mirror the exact tools and skills in the posting where they are true. Lists of soft traits
            (“passionate”, “dynamic”) do little for keyword matching.
          </Tip>
        </div>
      </Accordion>

      <Accordion
        number="04"
        title="Work experience"
        meta={`${resume.experience.filter((job) => job.role.trim()).length} roles · ${bulletCount} bullets`}
        complete={resume.experience.some(
          (job) => job.role.trim() && job.bullets.some((bullet) => bullet.trim()),
        )}
        open={open === "experience"}
        onToggle={() => setOpen("experience")}
      >
        <div className="space-y-3">
          {resume.experience.map((job, jobIndex) => (
            <div key={job.id} className="rounded-xl border border-line bg-cream/60">
              <div className="flex items-center justify-between gap-2 border-b border-line-soft px-3 py-2">
                <span className="flex min-w-0 items-center gap-1.5">
                  <span className="font-mono text-[9px] uppercase tracking-wide text-[#9aa49b]">
                    Role {String(jobIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate text-[11px] font-medium text-ink-soft">
                    {job.role.trim() || "New role"}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => removeJob(job.id)}
                  className="icon-btn !h-6 !w-6 hover:!bg-[#f6e6df] hover:!text-[#a64d31]"
                  aria-label={`Remove ${job.role.trim() || "role"}`}
                  title="Remove this role"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="space-y-2.5 p-3">
                <Field
                  label="Job title"
                  value={job.role}
                  onChange={(value) => updateJob(job.id, { role: value })}
                  placeholder="Operations Coordinator"
                />
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <Field
                    label="Company"
                    value={job.company}
                    onChange={(value) => updateJob(job.id, { company: value })}
                    placeholder="Bayview Community Health"
                  />
                  <Field
                    label="Location"
                    value={job.location}
                    onChange={(value) => updateJob(job.id, { location: value })}
                    placeholder="Oakland, CA"
                  />
                  <Field
                    label="Start"
                    value={job.start}
                    onChange={(value) => updateJob(job.id, { start: value })}
                    placeholder="Mar 2021"
                  />
                  <Field
                    label="End"
                    value={job.end}
                    onChange={(value) => updateJob(job.id, { end: value })}
                    placeholder="Present"
                  />
                </div>

                <div>
                  <span className="field-label">Achievements</span>
                  <div className="space-y-1.5">
                    {job.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="group flex items-start gap-1.5">
                        <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#809086]" />
                        <textarea
                          value={bullet}
                          onChange={(event) => updateBullet(job.id, bulletIndex, event.target.value)}
                          rows={2}
                          placeholder="Reduced reporting time by 20% by building an Excel tracking system."
                          aria-label={`Achievement ${bulletIndex + 1}`}
                          className="field resize-none !py-1.5 !text-[12px] leading-[1.5]"
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(job.id, bulletIndex)}
                          className="icon-btn !h-7 !w-7 shrink-0 opacity-60 group-hover:opacity-100 hover:!bg-[#f6e6df] hover:!text-[#a64d31]"
                          aria-label={`Remove achievement ${bulletIndex + 1}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addBullet(job.id)}
                    className="mt-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[10.5px] font-medium text-forest transition hover:bg-forest/[0.06]"
                  >
                    <Plus className="h-3 w-3" />
                    Add achievement
                  </button>
                </div>
              </div>
            </div>
          ))}

          <EmptyAdd label="Add another role" onClick={addJob} />
          <Tip>
            Lead with a verb, then a result: “Reduced reporting time by 20% by building…” Numbers are
            only persuasive when they are accurate.
          </Tip>
        </div>
      </Accordion>

      <Accordion
        number="05"
        title="Education"
        meta={
          resume.education.length
            ? `${resume.education.length} ${resume.education.length === 1 ? "entry" : "entries"}`
            : "Credential, school and year"
        }
        complete={resume.education.some((entry) => entry.school.trim() || entry.degree.trim())}
        open={open === "education"}
        onToggle={() => setOpen("education")}
      >
        <div className="space-y-2.5">
          {resume.education.map((entry, index) => (
            <div key={entry.id} className="rounded-xl border border-line bg-cream/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wide text-[#9aa49b]">
                  Entry {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    patchResume({
                      education: resume.education.filter((item) => item.id !== entry.id),
                    })
                  }
                  className="icon-btn !h-6 !w-6 hover:!bg-[#f6e6df] hover:!text-[#a64d31]"
                  aria-label="Remove education entry"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Field
                  label="Degree or credential"
                  value={entry.degree}
                  onChange={(value) => updateEducation(entry.id, { degree: value })}
                  placeholder="B.A. in Sociology"
                  className="sm:col-span-2"
                />
                <Field
                  label="School"
                  value={entry.school}
                  onChange={(value) => updateEducation(entry.id, { school: value })}
                  placeholder="University of California, Berkeley"
                />
                <Field
                  label="Location"
                  value={entry.location}
                  onChange={(value) => updateEducation(entry.id, { location: value })}
                  placeholder="Berkeley, CA"
                />
                <Field
                  label="Graduation year"
                  value={entry.year}
                  onChange={(value) => updateEducation(entry.id, { year: value })}
                  placeholder="2018"
                />
              </div>
            </div>
          ))}
          <EmptyAdd label="Add education" onClick={addEducation} />
        </div>
      </Accordion>

      <Accordion
        number="06"
        title="Certifications"
        meta={
          resume.certifications.length
            ? `${resume.certifications.length} ${resume.certifications.length === 1 ? "credential" : "credentials"}`
            : "Optional — but useful for ATS keywords"
        }
        complete={resume.certifications.some((entry) => entry.name.trim())}
        open={open === "certifications"}
        onToggle={() => setOpen("certifications")}
      >
        <div className="space-y-2.5">
          {resume.certifications.map((entry, index) => (
            <div key={entry.id} className="rounded-xl border border-line bg-cream/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wide text-[#9aa49b]">
                  Credential {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    patchResume({
                      certifications: resume.certifications.filter((item) => item.id !== entry.id),
                    })
                  }
                  className="icon-btn !h-6 !w-6 hover:!bg-[#f6e6df] hover:!text-[#a64d31]"
                  aria-label="Remove certification"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Field
                  label="Certification or course"
                  value={entry.name}
                  onChange={(value) => updateCertification(entry.id, { name: value })}
                  placeholder="Google Project Management Certificate"
                  className="sm:col-span-2"
                />
                <Field
                  label="Issuer"
                  value={entry.issuer}
                  onChange={(value) => updateCertification(entry.id, { issuer: value })}
                  placeholder="Google"
                />
                <Field
                  label="Year"
                  value={entry.year}
                  onChange={(value) => updateCertification(entry.id, { year: value })}
                  placeholder="2023"
                />
              </div>
            </div>
          ))}
          <EmptyAdd label="Add certification" onClick={addCertification} />
          <Tip>
            Include in-progress credentials with a target year, for example “PMP — expected 2026”.
            Skip certificates that do not relate to the role.
          </Tip>
        </div>
      </Accordion>

      <Accordion
        number="07"
        title="Awards & honors"
        meta={
          (resume.awards ?? []).length
            ? `${(resume.awards ?? []).length} ${(resume.awards ?? []).length === 1 ? "award" : "awards"}`
            : "Optional — competitions, scholarships, honors"
        }
        complete={(resume.awards ?? []).some((entry) => entry.title.trim())}
        open={open === "awards"}
        onToggle={() => setOpen("awards")}
      >
        <div className="space-y-2.5">
          {(resume.awards ?? []).map((entry, index) => (
            <div key={entry.id} className="rounded-xl border border-line bg-cream/60 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-wide text-[#9aa49b]">
                  Award {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => removeAward(entry.id)}
                  className="icon-btn !h-6 !w-6 hover:!bg-[#f6e6df] hover:!text-[#a64d31]"
                  aria-label="Remove award"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Field
                  label="Award or honor"
                  value={entry.title}
                  onChange={(value) => updateAward(entry.id, { title: value })}
                  placeholder="1st Place, National Debate Competition"
                  className="sm:col-span-2"
                />
                <Field
                  label="Issuer"
                  value={entry.issuer}
                  onChange={(value) => updateAward(entry.id, { issuer: value })}
                  placeholder="DRP Republic of Indonesia"
                />
                <Field
                  label="Year"
                  value={entry.year}
                  onChange={(value) => updateAward(entry.id, { year: value })}
                  placeholder="2023"
                />
              </div>
            </div>
          ))}
          <EmptyAdd label="Add award" onClick={addAward} />
          <Tip>
            Only list awards that strengthen the target role. Always keep the exact placing and issuer
            — recruiters may verify them.
          </Tip>
        </div>
      </Accordion>
    </div>
  );
}
