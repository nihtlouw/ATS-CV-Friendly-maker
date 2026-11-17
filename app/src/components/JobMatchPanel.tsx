import { Plus, Trash2 } from "lucide-react";
import type { Keyword } from "@/types";
import { sampleJobDescription } from "@/data/sample";
import { Chip } from "@/components/ui";

export function JobMatchPanel({ jobDescription, setJobDescription, keywords, onAddSkills, onToast }: {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  keywords: Keyword[];
  onAddSkills: (skills: string[]) => void;
  onToast: (message: string) => void;
}) {
  const matched = keywords.filter((keyword) => keyword.matched);
  const missing = keywords.filter((keyword) => !keyword.matched);

  return (
    <div className="space-y-5 px-4 py-5 sm:px-5">
      <div>
        <label htmlFor="job-description" className="field-label">Job description</label>
        <p id="job-description-help" className="mb-3 text-xs leading-5 text-muted">Paste a posting to compare its terms with your CV. This is a keyword check, not an employer’s ATS score.</p>
        <textarea id="job-description" className="field min-h-[200px] resize-y leading-relaxed" value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)} rows={9} aria-describedby="job-description-help" placeholder="Paste the responsibilities, requirements, and tools…" />
        <div className="mt-1 flex items-center justify-between gap-2">
          <button type="button" onClick={() => { setJobDescription(sampleJobDescription); onToast("Example job description loaded."); }} className="min-h-9 text-xs font-medium text-forest hover:underline">Try an example</button>
          {jobDescription && <button type="button" onClick={() => setJobDescription("")} className="inline-flex min-h-9 items-center gap-1.5 text-xs text-muted hover:text-ink"><Trash2 className="h-3.5 w-3.5" />Clear</button>}
        </div>
      </div>
      {jobDescription.trim() ? keywords.length > 0 ? (
        <div className="space-y-5 border-t border-line pt-4">
          <p className="text-sm font-medium text-ink" aria-live="polite">{matched.length} of {keywords.length} detected terms found</p>
          {missing.length > 0 && <div>
            <h2 className="mb-1 text-xs font-semibold text-ink-soft">Not found in your CV</h2>
            <p className="mb-3 text-xs leading-5 text-muted">Select a term to add it as a skill. Only add skills you actually have.</p>
            <div className="flex flex-wrap gap-2">
              {missing.map((keyword) => <Chip key={keyword.term} variant="missing" onClick={() => { onAddSkills([keyword.term]); onToast(`“${keyword.term}” added to skills.`); }} title={`Add ${keyword.term}`}>
                <Plus className="mr-1 inline h-3 w-3" />{keyword.term}
              </Chip>)}
            </div>
          </div>}
          {matched.length > 0 && <details className="text-xs text-muted">
            <summary className="min-h-8 cursor-pointer py-1.5">Found terms · {matched.length}</summary>
            <div className="mt-2 flex flex-wrap gap-2">{matched.map((keyword) => <Chip key={keyword.term} variant="matched">{keyword.term}</Chip>)}</div>
          </details>}
        </div>
      ) : <p className="text-xs leading-5 text-muted">No distinct terms detected. Include the requirements and tools section.</p>
      : <p className="text-xs text-muted">Your comparison will appear here.</p>}
    </div>
  );
}
