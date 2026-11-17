import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CircleAlert,
  Circle,
  ClipboardCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import type { SectionKey } from "@/types";
import type { analyzeResume } from "@/lib/ats";
import { cn } from "@/utils/cn";
import { ScoreRing } from "@/components/ui";

type Analysis = ReturnType<typeof analyzeResume>;
type JumpSection = "contact" | SectionKey | "jobmatch" | "design";

const jumpMap: Record<string, JumpSection> = {
  contact: "contact",
  headline: "contact",
  summary: "summary",
  skills: "skills",
  experience: "experience",
  impact: "experience",
  education: "education",
  keywords: "jobmatch",
  format: "design",
};

const statusIcon = {
  pass: <Check className="h-3 w-3 text-forest" strokeWidth={3} />,
  warn: <CircleAlert className="h-3 w-3 text-[#a1652f]" strokeWidth={2.4} />,
  todo: <Circle className="h-2.5 w-2.5 text-[#a9a394]" strokeWidth={2.6} />,
};

export function ScorePanel({
  analysis,
  onJump,
  hasJobDescription,
}: {
  analysis: Analysis;
  onJump: (section: JumpSection) => void;
  hasJobDescription: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      document
        .querySelector<HTMLButtonElement>(
          '[aria-labelledby="ats-review-title"] button[aria-label="Close"]',
        )
        ?.focus();
    }, 40);
    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const modal = document.getElementById("ats-review-title")?.closest('[role="dialog"]');
      if (!modal) return;
      const focusables = Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleTab);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keydown", handleTab);
      document.body.style.overflow = "";
    };
  }, [open]);

  const openCheck = (id: string) => {
    setOpen(false);
    onJump(jumpMap[id] ?? "summary");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-14 w-full items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 text-left transition hover:border-forest/30"
      >
        <ClipboardCheck className="h-5 w-5 shrink-0 text-forest" />
        <span className="flex-1 text-sm font-medium text-ink">Review CV</span>
        <span className="text-xs text-muted">{analysis.improvements.length ? `${analysis.improvements.length} ${analysis.improvements.length === 1 ? "suggestion" : "suggestions"}` : "View checks"}</span>
        <ArrowRight className="h-4 w-4 text-muted" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-5">
          <button
            type="button"
            aria-label="Close ATS review"
            className="absolute inset-0 cursor-default bg-ink/45 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ats-review-title"
            className="animate-fade-up relative flex max-h-[92vh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-2xl border border-line bg-paper shadow-[0_30px_80px_-20px_rgba(20,35,27,0.5)] sm:max-h-[86vh] sm:rounded-2xl"
          >
            <div className="flex items-start gap-4 border-b border-line px-5 pb-4 pt-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-forest/[0.08]">
                <ScoreRing score={analysis.score} size={38} stroke={3.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="microlabel text-[12px]">CV review</p>
                <h2 id="ats-review-title" className="mt-0.5 font-display text-[22px] font-medium leading-tight">
                  Content checklist
                </h2>
                <p className="mt-0.5 text-[12px] leading-4 text-muted">
                  {analysis.checks.filter((check) => check.status === "pass").length} of{" "}
                  {analysis.checks.length} checks passing · internal guidance only
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="icon-btn -mr-1 -mt-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-2">
                {analysis.checks.map((check) => {
                  const actionable = check.status !== "pass";
                  return (
                    <div
                      key={check.id}
                      className={cn(
                        "rounded-xl border px-3 py-2.5 transition",
                        check.status === "pass"
                          ? "border-line-soft bg-cream/55"
                          : "border-line bg-cream",
                      )}
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={cn(
                            "mt-[1px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border",
                            check.status === "pass"
                              ? "border-forest/15 bg-forest/[0.08]"
                              : check.status === "warn"
                                ? "border-[#d9b68a] bg-[#f8eddf]"
                                : "border-line bg-paper-2",
                          )}
                        >
                          {statusIcon[check.status]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-3">
                            <h3 className="text-[12.5px] font-semibold text-ink">{check.label}</h3>
                            <span className="shrink-0 font-mono text-[12px] tabular-nums text-muted">
                              {check.earned}/{check.max}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[12px] leading-[1.5] text-muted">{check.detail}</p>
                          {actionable && check.hint && (
                            <p className="mt-1.5 flex gap-1.5 text-[12px] leading-[1.45] text-ink-soft">
                              <Sparkles className="mt-[1px] h-3 w-3 shrink-0 text-clay" />
                              {check.hint}
                            </p>
                          )}
                          {actionable && check.id !== "format" && (
                            <button
                              type="button"
                              onClick={() => openCheck(check.id)}
                              className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-forest underline-offset-2 hover:underline"
                            >
                              Fix this
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-lime-soft/70 px-3 py-2.5 text-[12px] leading-[1.5] text-[#40543f]">
                <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
                <p>
                  These are writing suggestions, not a score from an employer’s ATS. Always check your final PDF before applying.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-line bg-paper-2/50 px-5 py-3">
              <button type="button" className="btn-ghost" onClick={() => setOpen(false)}>
                Keep editing
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  setOpen(false);
                  onJump(hasJobDescription ? "skills" : "jobmatch");
                }}
              >
                {hasJobDescription ? "Review skills" : "Match to a job post"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
