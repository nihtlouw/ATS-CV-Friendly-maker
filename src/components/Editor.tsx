import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { AlignLeft, Palette, Target } from "lucide-react";
import type { Design, JumpTarget, Keyword, Resume, SectionKey } from "@/types";
import { ContentPanel } from "@/components/ContentPanel";
import { JobMatchPanel } from "@/components/JobMatchPanel";
import { DesignPanel } from "@/components/DesignPanel";
import { cn } from "@/utils/cn";

type OpenKey = "contact" | SectionKey;
type Tab = "content" | "jobmatch" | "design";

export function Editor({
  resume,
  setResume,
  design,
  setDesign,
  jobDescription,
  setJobDescription,
  keywords,
  jump,
  onAddSkills,
  onToast,
}: {
  resume: Resume;
  setResume: Dispatch<SetStateAction<Resume>>;
  design: Design;
  setDesign: Dispatch<SetStateAction<Design>>;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  keywords: Keyword[];
  jump: JumpTarget;
  onAddSkills: (skills: string[]) => void;
  onToast: (message: string) => void;
}) {
  const [tab, setTab] = useState<Tab>("content");
  const [open, setOpen] = useState<OpenKey>("summary");

  useEffect(() => {
    if (!jump) return;
    if (jump.section === "jobmatch") {
      setTab("jobmatch");
      return;
    }
    if (jump.section === "design") {
      setTab("design");
      return;
    }
    setTab("content");
    setOpen(jump.section);
  }, [jump]);

  const matched = keywords.filter((keyword) => keyword.matched).length;

  const tabs: { id: Tab; label: string; icon: typeof AlignLeft; badge?: string }[] = [
    { id: "content", label: "Content", icon: AlignLeft },
    {
      id: "jobmatch",
      label: "Match",
      icon: Target,
      badge: jobDescription.trim() && keywords.length ? `${matched}/${keywords.length}` : undefined,
    },
    { id: "design", label: "Design", icon: Palette },
  ];

  return (
    <div
      id="cv-editor"
      className="overflow-hidden rounded-2xl border border-line bg-cream shadow-card"
    >
      <div className="flex items-stretch border-b border-line bg-[#f7f4ec]">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap px-2 py-2.5 text-[11.5px] font-medium transition sm:text-[12px]",
                active ? "bg-cream text-ink" : "text-muted hover:bg-cream/50 hover:text-ink",
              )}
            >
              <Icon className={cn("h-3.5 w-3.5", active ? "text-forest" : "text-[#93a096]")} />
              {item.label}
              {item.badge && (
                <span
                  className={cn(
                    "ml-0.5 rounded px-1 py-px font-mono text-[8.5px] tabular-nums",
                    active ? "bg-forest/[0.08] text-forest" : "bg-paper-2 text-muted",
                  )}
                >
                  {item.badge}
                </span>
              )}
              {active && (
                <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-t-full bg-forest" />
              )}
            </button>
          );
        })}
      </div>

      {tab === "content" && (
        <ContentPanel
          resume={resume}
          setResume={setResume}
          open={open}
          setOpen={setOpen}
          jobDescription={jobDescription}
          onToast={onToast}
        />
      )}
      {tab === "jobmatch" && (
        <JobMatchPanel
          resume={resume}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          keywords={keywords}
          onAddSkills={onAddSkills}
          onToast={onToast}
        />
      )}
      {tab === "design" && <DesignPanel design={design} setDesign={setDesign} />}
    </div>
  );
}
