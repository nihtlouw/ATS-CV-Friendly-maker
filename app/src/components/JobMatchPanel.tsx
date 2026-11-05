import {
  ArrowRight,
  Check,
  CircleDashed,
  ClipboardPaste,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import type { Keyword, Resume } from "@/types";
import { sampleJobDescription } from "@/data/sample";
import { Chip } from "@/components/ui";
import { cn } from "@/utils/cn";

export function JobMatchPanel({
  resume,
  jobDescription,
  setJobDescription,
  keywords,
  onAddSkills,
  onToast,
}: {
  resume: Resume;
  jobDescription: string;
  setJobDescription: (value: string) => void;
  keywords: Keyword[];
  onAddSkills: (skills: string[]) => void;
  onToast: (message: string) => void;
}) {
  const matched = keywords.filter((keyword) => keyword.matched);
  const missing = keywords.filter((keyword) => !keyword.matched);
  const percent = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;

  return (
    <div className="px-4 py-4 sm:px-5">
      <div className="flex items-start gap-2.5 rounded-xl bg-lime-soft/60 p-3">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-forest text-cream">
          <Target className="h-3.5 w-3.5" />
        </span>
        <div>
          <h2 className="text-[12.5px] font-semibold text-ink">Match the posting, not the myth.</h2>
          <p className="mt-0.5 text-[10.5px] leading-[1.5] text-[#5d6d60]">
            Paste the job description below. We pull out the skills and tools an ATS is likely to
            score, then compare them with your CV.
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <label htmlFor="job-description" className="field-label !mb-0">
            Job description
          </label>
          <span className="font-mono text-[9px] tabular-nums text-[#98a298]">
            {jobDescription.length.toLocaleString()} chars
          </span>
        </div>
        <textarea
          id="job-description"
          className="field min-h-[150px] resize-y leading-relaxed"
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          rows={7}
          placeholder="Paste the full posting here — responsibilities, requirements and tools. The more context, the better the match."
        />
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              setJobDescription(sampleJobDescription);
              onToast("Sample job description loaded.");
            }}
            className="inline-flex items-center gap-1 text-[10.5px] font-medium text-forest hover:underline"
          >
            <ClipboardPaste className="h-3 w-3" />
            Use a sample posting
          </button>
          {jobDescription && (
            <button
              type="button"
              onClick={() => setJobDescription("")}
              className="inline-flex items-center gap-1 text-[10.5px] text-muted transition hover:text-ink"
            >
              <Trash2 className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>
      </div>

      {jobDescription.trim() ? (
        keywords.length > 0 ? (
          <div className="mt-4 space-y-3">
            <div className="rounded-xl border border-line bg-cream p-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="microlabel text-[8.5px]">Keyword match</p>
                  <p className="mt-1 font-display text-[20px] leading-none text-ink">
                    {matched.length}
                    <span className="text-[13px] text-muted"> / {keywords.length}</span>
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-1 font-mono text-[9.5px] font-medium tabular-nums",
                    percent >= 60
                      ? "bg-forest/[0.08] text-forest"
                      : "bg-[#f7eddc] text-[#96602c]",
                  )}
                >
                  {percent}% matched
                </span>
              </div>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-paper-2">
                <div
                  className="h-full rounded-full bg-forest transition-[width] duration-500"
                  style={{ width: `${Math.max(2, percent)}%` }}
                />
              </div>
              <p className="mt-2 text-[10.5px] leading-4 text-muted">
                {matched.length === keywords.length
                  ? "Full coverage of the terms we spotted. Make sure every one is true."
                  : `${missing.length} relevant ${missing.length === 1 ? "term is" : "terms are"} missing from your CV. Add only what you can defend.`}
              </p>
            </div>

            {missing.length > 0 && (
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p className="microlabel flex items-center gap-1.5 text-[8.5px] text-[#96602c]">
                    <CircleDashed className="h-3 w-3" />
                    Missing from your CV · {missing.length}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onAddSkills(missing.map((keyword) => keyword.term));
                      onToast(`Added ${missing.length} keywords to your skills. Edit them in Content.`);
                    }}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-forest hover:underline"
                  >
                    Add all
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missing.map((keyword) => (
                    <Chip
                      key={keyword.term}
                      variant="missing"
                      onClick={() => {
                        onAddSkills([keyword.term]);
                        onToast(`“${keyword.term}” added to your skills.`);
                      }}
                      title={`Add ${keyword.term}`}
                    >
                      <span className="mr-0.5 inline-flex items-center">
                        <Plus className="h-2.5 w-2.5" />
                      </span>
                      {keyword.term}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="microlabel mb-1.5 flex items-center gap-1.5 text-[8.5px] text-forest">
                <Check className="h-3 w-3" strokeWidth={2.6} />
                Found in your CV · {matched.length}
              </p>
              {matched.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {matched.map((keyword) => (
                    <Chip key={keyword.term} variant="matched">
                      {keyword.term}
                    </Chip>
                  ))}
                </div>
              ) : (
                <p className="text-[10.5px] italic text-muted">
                  No matches yet. Add relevant skills or use the posting’s wording in your bullets.
                </p>
              )}
            </div>

            <div className="flex items-start gap-2 rounded-lg border border-line-soft bg-paper/60 px-2.5 py-2 text-[10px] leading-[1.5] text-[#627067]">
              <Sparkles className="mt-[1px] h-3 w-3 shrink-0 text-clay" />
              <p>
                Keep your skills list to 8–15 words you can back up in an interview. Keyword stuffing
                is easy for a recruiter to spot.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-line bg-cream/60 px-2.5 py-2">
              <span className="text-[10.5px] text-muted">
                {resume.skills.length} skills now in your CV
              </span>
              <span className="font-mono text-[8.5px] uppercase tracking-wide text-[#8b978d]">
                auto-synced
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-line bg-cream/60 px-4 py-6 text-center">
            <CircleDashed className="mx-auto h-5 w-5 text-[#a5aea4]" />
            <p className="mt-2 text-[11.5px] font-medium text-ink">No distinct keywords spotted yet.</p>
            <p className="mx-auto mt-1 max-w-[280px] text-[10.5px] leading-[1.5] text-muted">
              Paste a little more of the posting — the requirements and tools section works best.
            </p>
          </div>
        )
      ) : (
        <div className="mt-4 space-y-2">
          <div className="rounded-xl border border-dashed border-line bg-cream/50 p-4 text-center">
            <Target className="mx-auto h-5 w-5 text-[#a5aea4]" />
            <p className="mt-2 text-[12px] font-medium text-ink">Your match report appears here</p>
            <p className="mx-auto mt-1 max-w-[280px] text-[10.5px] leading-[1.5] text-muted">
              ATS software scores how closely your language mirrors the posting. We highlight the
              overlap and the gaps.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["01", "Hard skills", "Tools and methods from the posting."],
              ["02", "Job title", "Mirror it honestly under your name."],
              ["03", "Proof", "Numbers that support the claims."],
            ].map(([number, title, detail]) => (
              <div key={number} className="rounded-lg border border-line-soft bg-paper/50 p-2.5">
                <span className="font-mono text-[8.5px] text-[#a3ada3]">{number}</span>
                <p className="mt-1 text-[10.5px] font-semibold text-ink-soft">{title}</p>
                <p className="mt-0.5 text-[9.5px] leading-[1.45] text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
