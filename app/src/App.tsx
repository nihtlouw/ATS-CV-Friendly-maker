import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { AlignLeft, Eye, FileText, X } from "lucide-react";
import type { AppState, CvProfile, Design, JumpTarget, Resume } from "@/types";
import { initialState, sampleResume, starterResume } from "@/data/sample";
import { analyzeResume, uid } from "@/lib/ats";
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
  const [saveState, setSaveState] = useState<"saved" | "saving" | "error">("saved");
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
        setSaveState("error");
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
    if (!window.confirm("Replace your current draft with the example CV? Save the current version first if you want to keep it.")) return;
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
    try {
      window.localStorage.setItem(PROFILES_KEY, JSON.stringify(next));
      setProfiles(next);
      return true;
    } catch {
      showToast("Could not save versions. Browser storage may be full or unavailable.");
      return false;
    }
  };

  const handleSaveProfile = useCallback(() => {
    const suggested = resume.title.trim()
      ? `${resume.name.trim() || "CV"} — ${resume.title.trim()}`
      : resume.name.trim() || "Untitled CV";
    const name = window.prompt("Name this CV version:", suggested);
    if (!name || !name.trim()) return;
    const profile: CvProfile = {
      id: uid(),
      name: name.trim().slice(0, 80),
      savedAt: Date.now(),
      state: { resume, design, jobDescription },
    };
    if (!persistProfiles([profile, ...profiles])) return;
    showToast(`Version “${profile.name}” saved in this browser.`);
  }, [resume, design, jobDescription, profiles, showToast]);

  const handleLoadProfile = useCallback(
    (id: string) => {
      const profile = profiles.find((item) => item.id === id);
      if (!profile || !window.confirm("Replace your current draft with this saved version? Save the current version first if you want to keep it.")) return;
      setResume(profile.state.resume);
      setDesign(profile.state.design);
      setJobDescription(profile.state.jobDescription);
      showToast(`Loaded version “${profile.name}”.`);
    },
    [profiles, showToast],
  );

  const handleDeleteProfile = useCallback(
    (id: string) => {
      const profile = profiles.find((item) => item.id === id);
      if (!profile || !window.confirm(`Delete saved version “${profile.name}”?`)) return;
      if (!persistProfiles(profiles.filter((item) => item.id !== id))) return;
      if (profile) showToast(`Deleted version “${profile.name}”.`);
    },
    [profiles, showToast],
  );

  const setResumeSafe: Dispatch<SetStateAction<Resume>> = setResume;
  const setDesignSafe: Dispatch<SetStateAction<Design>> = setDesign;

  return (
    <div id="top" className="min-h-screen bg-paper">
      <Header
        resumeName={resume.name}
        saveState={saveState}
        onPrint={handlePrint}
        onUseSample={handleUseSample}
        onStartBlank={() => setConfirmBlank(true)}
        profiles={profiles}
        onSaveProfile={handleSaveProfile}
        onLoadProfile={handleLoadProfile}
        onDeleteProfile={handleDeleteProfile}
      />

      <main className="mx-auto max-w-[1800px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <h1 className="sr-only">CV editor</h1>
        {saveState === "error" && (
          <div role="alert" className="mb-4 rounded-lg border border-[#dfb9a6] bg-[#fff5ef] px-4 py-3 text-sm text-[#8f4026]">
            Your latest changes aren’t saved. Keep this tab open and save a PDF before leaving.
          </div>
        )}
        <div className="mb-4 flex rounded-lg border border-line bg-paper-2 p-1 lg:hidden" role="group" aria-label="Workspace view">
          <button type="button" aria-pressed={mobileView === "edit"} onClick={() => setMobileView("edit")}
            className={cn("flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium", mobileView === "edit" ? "bg-white text-ink shadow-sm" : "text-muted")}>
            <AlignLeft className="h-4 w-4" />Edit
          </button>
          <button type="button" aria-pressed={mobileView === "preview"} onClick={() => setMobileView("preview")}
            className={cn("flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md text-sm font-medium", mobileView === "preview" ? "bg-white text-ink shadow-sm" : "text-muted")}>
            <Eye className="h-4 w-4" />Preview
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[410px_minmax(0,1fr)] xl:gap-7">
          <section aria-label="Edit CV" className={cn("min-w-0 space-y-4", mobileView === "preview" && "hidden lg:block")}>
            {resume.name.trim() === sampleResume.name && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white px-4 py-3 text-[13px]">
                <span className="text-muted">You’re editing an example.</span>
                <button type="button" className="min-h-8 shrink-0 font-semibold text-forest hover:underline" onClick={() => setConfirmBlank(true)}>Start your CV</button>
              </div>
            )}
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
            <ScorePanel analysis={analysis} onJump={handleJump} hasJobDescription={jobDescription.trim().length > 0} />
            <p className="px-1 text-xs leading-5 text-muted sm:hidden" role="status">
              {saveState === "error" ? "Changes not saved" : saveState === "saving" ? "Saving…" : "Saved in this browser only"}
            </p>
          </section>
          <div className={cn("min-w-0", mobileView === "edit" && "hidden lg:block")}>
            <Preview resume={resume} design={design} />
          </div>
        </div>
      </main>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex justify-center px-4">
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            onClick={() => setToast(null)}
            className="animate-toast pointer-events-auto flex max-w-[520px] cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-ink px-3.5 py-2.5 text-[11.5px] font-medium leading-[1.4] text-cream shadow-[0_18px_45px_-12px_rgba(15,28,21,0.6)]"
          >
            {toast.message}
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="ml-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded text-cream/50 transition hover:bg-white/10 hover:text-cream"
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
              This replaces your current draft and job description. Save a version from CV options first if you want to keep them.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" autoFocus className="btn-ghost" onClick={() => setConfirmBlank(false)}>
                Keep editing
              </button>
              <button
                type="button"
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
