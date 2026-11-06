import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  AlignLeft,
  Check,
  Eye,
  FileText,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { AppState, CvProfile, Design, JumpTarget, Resume } from "@/types";
import { initialState, sampleResume, starterResume } from "@/data/sample";
import { analyzeResume, buildPlainText, uid } from "@/lib/ats";
import { Header } from "@/components/Header";
import { ScorePanel } from "@/components/ScorePanel";
import { Editor } from "@/components/Editor";
import { Preview, PrintSheet } from "@/components/Preview";
import { cn } from "@/utils/cn";

const STORAGE_KEY = "plainly.cv.v1";
const PROFILES_KEY = "plainly.cv.profiles.v1";

function loadProfiles(): CvProfile[] {
  try {
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((p) => p && p.id && p.state?.resume && p.state?.design) : [];
  } catch {
    return [];
  }
}

function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || typeof parsed !== "object" || !parsed.resume || !parsed.design) {
      return initialState;
    }

    const source = { ...initialState.resume, ...(parsed.resume as Partial<Resume>) };
    const designSource = { ...initialState.design, ...(parsed.design as Partial<Design>) };
    const resume: Resume = {
      ...source,
      name: typeof source.name === "string" ? source.name : "",
      title: typeof source.title === "string" ? source.title : "",
      email: typeof source.email === "string" ? source.email : "",
      phone: typeof source.phone === "string" ? source.phone : "",
      location: typeof source.location === "string" ? source.location : "",
      linkedin: typeof source.linkedin === "string" ? source.linkedin : "",
      summary: typeof source.summary === "string" ? source.summary : "",
      skills: Array.isArray(source.skills)
        ? source.skills.filter((skill): skill is string => typeof skill === "string")
        : [],
      softSkills: Array.isArray(source.softSkills)
        ? source.softSkills.filter((skill): skill is string => typeof skill === "string")
        : [],
      experience: Array.isArray(source.experience)
        ? source.experience.map((job) => ({
            id: String(job?.id ?? uid()),
            role: typeof job?.role === "string" ? job.role : "",
            company: typeof job?.company === "string" ? job.company : "",
            location: typeof job?.location === "string" ? job.location : "",
            start: typeof job?.start === "string" ? job.start : "",
            end: typeof job?.end === "string" ? job.end : "",
            bullets: Array.isArray(job?.bullets)
              ? job.bullets.filter((bullet): bullet is string => typeof bullet === "string")
              : [],
          }))
        : [],
      education: Array.isArray(source.education)
        ? source.education.map((entry) => ({
            id: String(entry?.id ?? uid()),
            degree: typeof entry?.degree === "string" ? entry.degree : "",
            school: typeof entry?.school === "string" ? entry.school : "",
            location: typeof entry?.location === "string" ? entry.location : "",
            year: typeof entry?.year === "string" ? entry.year : "",
          }))
        : [],
      certifications: Array.isArray(source.certifications)
        ? source.certifications.map((entry) => ({
            id: String(entry?.id ?? uid()),
            name: typeof entry?.name === "string" ? entry.name : "",
            issuer: typeof entry?.issuer === "string" ? entry.issuer : "",
            year: typeof entry?.year === "string" ? entry.year : "",
          }))
        : [],
      awards: Array.isArray(source.awards)
        ? source.awards.map((entry) => ({
            id: String(entry?.id ?? uid()),
            title: typeof entry?.title === "string" ? entry.title : "",
            issuer: typeof entry?.issuer === "string" ? entry.issuer : "",
            year: typeof entry?.year === "string" ? entry.year : "",
          }))
        : [],
    };

    const validTemplates = [
      "classic",
      "modern",
      "compact",
      "minimal",
      "executive",
      "technical",
      "formal",
    ] as const;
    const template = validTemplates.includes(designSource.template)
      ? designSource.template
      : "modern";
    const validAccents = ["forest", "ink", "navy", "plum", "clay"] as const;
    const accent = validAccents.includes(designSource.accent) ? designSource.accent : "forest";
    const headingAlign = designSource.headingAlign === "center" ? "center" : "left";
    const skillsStyle = designSource.skillsStyle === "bullets" ? "bullets" : "comma";
    const validFonts = ["arial", "segoe", "calibri", "georgia"] as const;
    const font = validFonts.includes(designSource.font) ? designSource.font : "segoe";
    const validSections = ["summary", "skills", "softSkills", "experience", "education", "certifications", "awards"] as const;
    const savedOrder = Array.isArray(designSource.sectionOrder) ? designSource.sectionOrder : [];
    const sectionOrder = [
      ...savedOrder.filter((key): key is (typeof validSections)[number] =>
        (validSections as readonly string[]).includes(key),
      ),
      ...validSections.filter((key) => !savedOrder.includes(key)),
    ];

    return {
      resume,
      design: {
        template,
        paper: designSource.paper === "a4" ? "a4" : "letter",
        density: designSource.density === "compact" ? "compact" : "comfortable",
        accent,
        headingAlign,
        skillsStyle,
        font,
        visible: {
          summary: designSource.visible?.summary !== false,
          skills: designSource.visible?.skills !== false,
          softSkills: designSource.visible?.softSkills !== false,
          experience: designSource.visible?.experience !== false,
          education: designSource.visible?.education !== false,
          certifications: designSource.visible?.certifications !== false,
          awards: designSource.visible?.awards !== false,
        },
        sectionOrder,
      },
      jobDescription:
        typeof parsed.jobDescription === "string" ? parsed.jobDescription : "",
    };
  } catch {
    return initialState;
  }
}

const slug = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "cv";

export default function App() {
  const [initial] = useState<AppState>(() => loadState());
  const [resume, setResume] = useState<Resume>(initial.resume);
  const [design, setDesign] = useState<Design>(initial.design);
  const [jobDescription, setJobDescription] = useState(initial.jobDescription);
  const [saveState, setSaveState] = useState<"saved" | "saving">("saved");
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [jump, setJump] = useState<JumpTarget>(null);
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [confirmBlank, setConfirmBlank] = useState(false);
  const [profiles, setProfiles] = useState<CvProfile[]>(() => loadProfiles());
  const toastTimer = useRef<number | null>(null);
  const firstRender = useRef(true);

  const analysis = useMemo(() => analyzeResume(resume, jobDescription), [resume, jobDescription]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ resume, design, jobDescription } satisfies AppState),
        );
        setSaveState("saved");
      } catch {
        setSaveState("saved");
      }
    }, 550);
    return () => window.clearTimeout(timer);
  }, [resume, design, jobDescription]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setToast(null);
        setConfirmBlank(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message });
    toastTimer.current = window.setTimeout(() => setToast(null), 3400);
  }, []);

  const handleJump = useCallback((section: NonNullable<JumpTarget>["section"]) => {
    setJump({ section, nonce: Date.now() });
    setMobileView("edit");
    window.setTimeout(() => {
      document.getElementById("cv-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 90);
  }, []);

  const plainText = useMemo(() => buildPlainText(resume, design), [resume, design]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      showToast("Plain-text CV copied. Paste it into an application or email.");
    } catch {
      const area = document.createElement("textarea");
      area.value = plainText;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        showToast("Plain-text CV copied.");
      } catch {
        showToast("Copy failed — select the text in the preview instead.");
      }
      document.body.removeChild(area);
    }
  }, [plainText, showToast]);

  const handlePrint = useCallback(() => {
    const previousTitle = document.title;
    document.title = `${slug(resume.name).replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase())} — CV`;
    window.setTimeout(() => {
      try {
        window.print();
      } finally {
        document.title = previousTitle;
      }
    }, 120);
  }, [resume.name]);

  const handleDownloadTxt = useCallback(() => {
    const blob = new Blob([plainText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug(resume.name)}-cv.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Plain-text CV downloaded as a .txt file.");
  }, [plainText, resume.name, showToast]);

  const handleAddSkills = useCallback((skills: string[]) => {
    setResume((prev) => {
      const existing = new Set(prev.skills.map((skill) => skill.toLowerCase()));
      const additions = skills
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0 && !existing.has(skill.toLowerCase()));
      if (!additions.length) return prev;
      return { ...prev, skills: [...prev.skills, ...additions] };
    });
  }, []);

  const handleUseSample = useCallback(() => {
    setResume({
      ...sampleResume,
      experience: sampleResume.experience.map((job) => ({
        ...job,
        id: uid(),
        bullets: [...job.bullets],
      })),
      education: sampleResume.education.map((entry) => ({ ...entry, id: uid() })),
      certifications: sampleResume.certifications.map((entry) => ({ ...entry, id: uid() })),
    });
    showToast("Sample CV restored. Make every line yours before applying.");
  }, [showToast]);

  const handleStartBlank = useCallback(() => {
    setResume({
      ...starterResume,
      experience: [],
      education: [],
      certifications: [],
      skills: [],
    });
    setJobDescription("");
    setConfirmBlank(false);
    showToast("Blank CV ready. Start with your contact details.");
    setJump({ section: "contact", nonce: Date.now() });
    setMobileView("edit");
  }, [showToast]);

  const persistProfiles = (next: CvProfile[]) => {
    setProfiles(next);
    try {
      window.localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
    } catch {
      /* storage full — ignore */
    }
  };

  const handleSaveProfile = useCallback(() => {
    const suggested = resume.title.trim()
      ? `${resume.name.trim() || "CV"} — ${resume.title.trim()}`
      : resume.name.trim() || "Untitled CV";
    const name = window.prompt("Name this CV profile (e.g. version for a specific job):", suggested);
    if (!name || !name.trim()) return;
    const profile: CvProfile = {
      id: uid(),
      name: name.trim().slice(0, 80),
      savedAt: Date.now(),
      state: { resume, design, jobDescription },
    };
    persistProfiles([profile, ...profiles]);
    showToast(`Profile “${profile.name}” saved in this browser.`);
  }, [resume, design, jobDescription, profiles, showToast]);

  const handleLoadProfile = useCallback(
    (id: string) => {
      const profile = profiles.find((item) => item.id === id);
      if (!profile) return;
      setResume(profile.state.resume);
      setDesign(profile.state.design);
      setJobDescription(profile.state.jobDescription);
      showToast(`Loaded profile “${profile.name}”.`);
    },
    [profiles, showToast],
  );

  const handleDeleteProfile = useCallback(
    (id: string) => {
      const profile = profiles.find((item) => item.id === id);
      persistProfiles(profiles.filter((item) => item.id !== id));
      if (profile) showToast(`Deleted profile “${profile.name}”.`);
    },
    [profiles, showToast],
  );

  const setResumeSafe: Dispatch<SetStateAction<Resume>> = setResume;
  const setDesignSafe: Dispatch<SetStateAction<Design>> = setDesign;

  return (
    <div id="top" className="min-h-screen bg-paper">
      <Header
        resumeName={resume.name}
        title={resume.title}
        score={analysis.score}
        saveState={saveState}
        onCopy={handleCopy}
        onPrint={handlePrint}
        onDownloadTxt={handleDownloadTxt}
        onUseSample={handleUseSample}
        onStartBlank={() => setConfirmBlank(true)}
        profiles={profiles}
        onSaveProfile={handleSaveProfile}
        onLoadProfile={handleLoadProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <main className="mx-auto max-w-[1640px] px-4 pb-14 sm:px-6 lg:px-8">
        <section className="pb-5 pt-6 sm:pb-6 sm:pt-8">
          <div className="flex items-center gap-2">
            <span className="h-1 w-1 rounded-full bg-forest" />
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-forest">
              Free ATS-friendly CV studio
            </span>
            <span className="ml-1 hidden h-px w-8 bg-line sm:block" />
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.12em] text-[#98a298] sm:block">
              no sign-up
            </span>
          </div>
          <div className="mt-2.5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-[760px] font-display text-[32px] font-medium leading-[1.04] tracking-[-0.025em] text-ink sm:text-[40px] lg:text-[44px]">
                Make a CV that survives the scan{" "}
                <em className="font-normal italic text-forest">and gets read.</em>
              </h1>
              <p className="mt-2.5 max-w-[640px] text-[12px] leading-[1.6] text-muted sm:text-[13px]">
                One clean column. Standard headings. Achievement-first bullets. Paste a job post to
                find the keywords you are missing, then export a text-based PDF or plain text.
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 lg:max-w-[300px] lg:justify-end">
              {[
                { icon: ShieldCheck, label: "ATS-safe by design" },
                { icon: Target, label: "Live keyword match" },
                { icon: FileText, label: "PDF & plain text" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream/60 px-2.5 py-1 text-[10px] font-medium text-ink-soft"
                >
                  <Icon className="h-3 w-3 text-forest" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="sticky top-16 z-30 -mx-4 mb-3 border-b border-line/70 bg-paper/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
          <div className="flex rounded-xl border border-line bg-paper-2/60 p-1">
            <button
              type="button"
              onClick={() => setMobileView("edit")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11.5px] font-medium transition",
                mobileView === "edit" ? "bg-cream text-ink shadow-sm ring-1 ring-line" : "text-muted",
              )}
            >
              <AlignLeft className="h-3.5 w-3.5" />
              Edit CV
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-[11.5px] font-medium transition",
                mobileView === "preview" ? "bg-cream text-ink shadow-sm ring-1 ring-line" : "text-muted",
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
              <span className="rounded bg-forest/[0.07] px-1 font-mono text-[8px] tabular-nums text-forest">
                {analysis.score}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(360px,420px)_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[452px_minmax(0,1fr)] xl:gap-7">
          <div
            className={cn(
              "min-w-0 space-y-3",
              mobileView === "preview" && "hidden lg:block",
            )}
          >
            <div className="flex items-center justify-between gap-2 px-0.5">
              <span className="flex min-w-0 items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.13em] text-[#8b978d]">
                <span className="h-1 w-1 shrink-0 rounded-full bg-clay" />
                <span className="truncate">
                  {resume.name.trim() === sampleResume.name
                    ? "Sample CV — replace it with your details"
                    : resume.name.trim()
                      ? "Your CV — edit any section"
                      : "Blank CV — start with your details"}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-[#9aa49b]">
                <span
                  className={cn(
                    "h-1 w-1 rounded-full",
                    saveState === "saved" ? "bg-[#9db5a1]" : "bg-[#c9a35c]",
                  )}
                />
                {saveState === "saved" ? "Saved locally" : "Saving"}
              </span>
            </div>

            <ScorePanel
              analysis={analysis}
              onJump={handleJump}
              hasJobDescription={jobDescription.trim().length > 0}
            />

            <Editor
              resume={resume}
              setResume={setResumeSafe}
              design={design}
              setDesign={setDesignSafe}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              keywords={analysis.keywords}
              jump={jump}
              onAddSkills={handleAddSkills}
              onToast={showToast}
            />

            <div className="flex items-start gap-2 rounded-xl border border-line/80 bg-cream/45 px-3 py-2.5">
              <Sparkles className="mt-px h-3.5 w-3.5 shrink-0 text-clay" />
              <p className="text-[10px] leading-[1.55] text-[#7a867d]">
                Your work is saved automatically in this browser. Nothing is uploaded — this is a
                private, local-first editor.
              </p>
            </div>
          </div>

          <div className={cn("min-w-0", mobileView === "edit" && "hidden lg:block")}>
            <Preview
              resume={resume}
              design={design}
              onPrint={handlePrint}
              onDownloadTxt={handleDownloadTxt}
            />
          </div>
        </div>

        <section className="mt-12 border-t border-line pt-7 sm:mt-14">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="microlabel text-[9px]">The honest rules</p>
              <h2 className="mt-1 font-display text-[24px] leading-tight tracking-[-0.02em] text-ink sm:text-[28px]">
                Three habits that keep you readable.
              </h2>
            </div>
            <p className="max-w-[420px] text-[11px] leading-[1.6] text-muted">
              No trick gets a CV past a recruiter. These keep your evidence legible to both a parser
              and a person.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                number: "01",
                title: "Keep it parseable",
                body: "Skip tables, text boxes, columns, icons and header images. Use standard headings and real, selectable text.",
              },
              {
                number: "02",
                title: "Prove the outcome",
                body: "Every bullet: action + result + a number you can defend. “Reduced reporting time by 20%” beats “responsible for reports”.",
              },
              {
                number: "03",
                title: "Tailor the top third",
                body: "Your title, summary and skills should mirror the posting in plain language. Keywords only work when they are true.",
              },
            ].map((rule) => (
              <div
                key={rule.number}
                className="rounded-xl border border-line bg-cream/55 p-4 transition hover:border-ink/20"
              >
                <span className="font-mono text-[9px] tracking-[0.14em] text-[#a3ada3]">
                  {rule.number}
                </span>
                <h3 className="mt-2 text-[13px] font-semibold text-ink">{rule.title}</h3>
                <p className="mt-1.5 text-[11px] leading-[1.6] text-muted">{rule.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line bg-paper-2/40">
        <div className="mx-auto flex max-w-[1640px] flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="grid h-5 w-5 place-items-center rounded bg-forest">
              <Check className="h-3 w-3 text-lime" strokeWidth={3} />
            </span>
            <p className="text-[10.5px] text-[#7a867d]">
              <span className="font-display text-[13px] font-semibold text-ink">Plainly.</span>{" "}
              A quiet, ATS-friendly CV studio.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[8.5px] uppercase tracking-[0.1em] text-[#939f95]">
            <span>No sign-up</span>
            <span className="h-1 w-1 rounded-full bg-[#c8c1b1]" />
            <span>No uploads</span>
            <span className="h-1 w-1 rounded-full bg-[#c8c1b1]" />
            <span>Saved locally</span>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4">
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            onClick={() => setToast(null)}
            className="animate-toast pointer-events-auto flex max-w-[520px] cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-ink px-3.5 py-2.5 text-[11.5px] font-medium leading-[1.4] text-cream shadow-[0_18px_45px_-12px_rgba(15,28,21,0.6)]"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/15">
              <Check className="h-3 w-3 text-lime" strokeWidth={3} />
            </span>
            {toast.message}
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded text-cream/50 transition hover:bg-white/10 hover:text-cream"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <PrintSheet resume={resume} design={design} />

      {confirmBlank && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Cancel and keep my CV"
            onClick={() => setConfirmBlank(false)}
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="blank-dialog-title"
            className="animate-fade-up relative w-full max-w-[400px] rounded-2xl border border-line bg-paper p-5 shadow-[0_30px_80px_-20px_rgba(20,35,27,0.5)]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f2e5dc]">
              <FileText className="h-4 w-4 text-clay" />
            </div>
            <h2
              id="blank-dialog-title"
              className="mt-3 font-display text-[22px] leading-tight tracking-[-0.01em] text-ink"
            >
              Start from a blank CV?
            </h2>
            <p className="mt-1.5 text-[11.5px] leading-[1.6] text-muted">
              This clears every section and the job description from this browser. You can restore
              the sample CV at any time from the menu.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" className="btn-ghost" onClick={() => setConfirmBlank(false)}>
                Keep editing
              </button>
              <button
                type="button"
                autoFocus
                className="inline-flex items-center gap-1.5 rounded-xl bg-forest px-3.5 py-2 text-[12px] font-semibold text-cream transition hover:bg-forest-2"
                onClick={handleStartBlank}
              >
                Clear and start
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
