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
  const next = analysis.nextAction;

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
      <div className="relative overflow-hidden rounded-2xl bg-forest p-4 text-cream shadow-card sm:p-5">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/[0.045]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-8 h-40 w-40 rounded-full border border-white/[0.06]"
        />
        <div className="relative flex items-start gap-4">
          <ScoreRing score={analysis.score} size={64} stroke={5} tone="dark" />
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-lime/90">
                <span className="h-1 w-1 rounded-full bg-lime" />
                ATS readiness
              </span>
              <span className="rounded-full border border-white/15 px-1.5 py-0.5 font-mono text-[9px] tabular-nums text-cream/70">
                {analysis.score}/100
              </span>
            </div>
            <h2 className="mt-1 font-display text-[21px] font-medium leading-tight tracking-[-0.01em] text-cream">
              {analysis.score >= 90
                ? "Your CV is ATS-ready."
                : analysis.score >= 75
                  ? "You're nearly there."
                  : "A few fixes to go."}
            </h2>
            <p className="mt-1 line-clamp-2 text-[11px] leading-[1.45] text-cream/65">
              {analysis.improvements.length === 0
                ? "Every check passes. Research the company and apply."
                : analysis.improvements.length === 1
                  ? "One check left: finish it, then export."
                  : `${analysis.improvements.length} small fixes left — start with “${next?.label}”.`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-[11.5px] font-medium text-cream transition hover:bg-white/[0.12] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
        >
          <span className="flex items-center gap-2">
            <ClipboardCheck className="h-3.5 w-3.5 text-lime/90" />
            Review {analysis.checks.length} ATS checks
          </span>
          <ArrowRight className="h-3.5 w-3.5 text-cream/60" />
        </button>
      </div>

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
                <p className="microlabel text-[9px]">ATS readiness review</p>
                <h2 id="ats-review-title" className="mt-0.5 font-display text-[22px] font-medium leading-tight">
                  {analysis.label}. {analysis.score}/100.
                </h2>
                <p className="mt-0.5 text-[11.5px] leading-4 text-muted">
                  {analysis.checks.filter((check) => check.status === "pass").length} of{" "}
                  {analysis.checks.length} checks passing · built for real parsers
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
                            <span className="shrink-0 font-mono text-[9.5px] tabular-nums text-muted">
                              {check.earned}/{check.max}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-[1.5] text-muted">{check.detail}</p>
                          {actionable && check.hint && (
                            <p className="mt-1.5 flex gap-1.5 text-[10.5px] leading-[1.45] text-ink-soft">
                              <Sparkles className="mt-[1px] h-3 w-3 shrink-0 text-clay" />
                              {check.hint}
                            </p>
                          )}
                          {actionable && check.id !== "format" && (
                            <button
                              type="button"
                              onClick={() => openCheck(check.id)}
                              className="mt-1.5 inline-flex items-center gap-1 text-[10.5px] font-semibold text-forest underline-offset-2 hover:underline"
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
              <div className="mt-3 flex items-start gap-2.5 rounded-xl bg-lime-soft/70 px-3 py-2.5 text-[10.5px] leading-[1.5] text-[#40543f]">
                <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
                <p>
                  No score guarantees an interview. This checks readability and coverage — the evidence
                  in your bullets still has to earn the callback.
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
