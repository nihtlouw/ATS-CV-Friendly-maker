import type { Dispatch, SetStateAction } from "react";
import { AlignJustify, ArrowDown, ArrowUp, Check, FileText, Rows3, ShieldCheck } from "lucide-react";
import type { Design, SectionKey, TemplateId } from "@/types";
import { ACCENTS, FONTS } from "@/lib/ats";
import { Segmented, Switch } from "@/components/ui";
import { cn } from "@/utils/cn";

const templates: { id: TemplateId; name: string; detail: string }[] = [
  { id: "classic", name: "Classic", detail: "Serif · editorial" },
  { id: "modern", name: "Modern", detail: "Sans · crisp" },
  { id: "compact", name: "Compact", detail: "Sans · condensed" },
];

const sectionOptions: { key: SectionKey; label: string; description: string }[] = [
  { key: "summary", label: "Professional summary", description: "Your target role and strengths" },
  { key: "skills", label: "Core skills", description: "Keywords and tools" },
  { key: "softSkills", label: "Soft skills", description: "Communication and teamwork" },
  { key: "experience", label: "Work experience", description: "Roles, dates and achievements" },
  { key: "education", label: "Education", description: "Credential, school and year" },
  { key: "certifications", label: "Certifications", description: "Optional credentials" },
  { key: "awards", label: "Awards & honors", description: "Competitions and scholarships" },
];

function MiniSheet({ template, active }: { template: TemplateId; active: boolean }) {
  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "Arial, Helvetica, sans-serif";
  const centered = template === "classic";
  return (
    <div
      className={cn(
        "flex h-[74px] flex-col overflow-hidden rounded-[5px] border bg-white px-2.5 pt-2.5 transition",
        active ? "border-[#c9d4c9]" : "border-[#e4e0d5]",
      )}
    >
      <div style={{ textAlign: centered ? "center" : "left" }}>
        <div
          style={{
            fontFamily: template === "classic" ? serif : sans,
            fontWeight: template === "classic" ? 400 : 700,
            fontSize: template === "compact" ? 7.5 : 8,
            color: "#1b2a23",
            letterSpacing: template === "classic" ? "0.01em" : "-0.02em",
          }}
        >
          Amara Okonkwo
        </div>
        <div
          style={{
            marginTop: 2,
            fontFamily: sans,
            fontSize: 3.6,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: template === "classic" ? "#3d5848" : "#1b4b39",
            textAlign: centered ? "center" : "left",
          }}
        >
          Program Coordinator
        </div>
        <div
          style={{
            height: 1,
            marginTop: 2.5,
            background: template === "classic" ? "#c9d1c9" : "#1b4b39",
            opacity: 0.55,
          }}
        />
      </div>
      <div className="mt-1.5 flex flex-1 flex-col gap-[3px]">
        <div
          style={{
            width: "28%",
            height: 2.4,
            background: "#7a8f7f",
            borderRadius: 1,
            alignSelf: centered ? "center" : "flex-start",
          }}
        />
        {[95, 86, 72].map((width, index) => (
          <div
            key={index}
            style={{
              width: `${width}%`,
              height: 1.8,
              background: "#dfe3db",
              borderRadius: 1,
              alignSelf: centered ? "center" : "flex-start",
            }}
          />
        ))}
        <div className="flex gap-1 pt-0.5">
          <div
            style={{
              width: `${template === "compact" ? 45 : 38}%`,
              height: 1.8,
              background: "#dfe3db",
              borderRadius: 1,
            }}
          />
          <div
            style={{
              width: "22%",
              height: 1.8,
              background: "#dfe3db",
              borderRadius: 1,
              marginLeft: "auto",
            }}
          />
        </div>
        {template !== "compact" &&
          [90, 64].map((width, index) => (
            <div
              key={index}
              style={{
                width: `${width}%`,
                height: 1.8,
                background: "#dfe3db",
                borderRadius: 1,
              }}
            />
          ))}
      </div>
    </div>
  );
}

export function DesignPanel({
  design,
  setDesign,
}: {
  design: Design;
  setDesign: Dispatch<SetStateAction<Design>>;
}) {
  return (
    <div className="space-y-4 px-4 py-4 sm:px-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="field-label !mb-0">Template</p>
          <span className="font-mono text-[8.5px] uppercase tracking-wide text-[#8b978d]">
            Typography only
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {templates.map((template) => {
            const active = design.template === template.id;
            return (
              <button
                key={template.id}
                type="button"
                aria-pressed={active}
                onClick={() => setDesign((prev) => ({ ...prev, template: template.id }))}
                className={cn(
                  "group rounded-xl border p-1.5 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
                  active
                    ? "border-forest/50 bg-cream shadow-sm ring-1 ring-forest/10"
                    : "border-line bg-cream/40 hover:border-ink/25 hover:bg-cream",
                )}
              >
                <MiniSheet template={template.id} active={active} />
                <div className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
                  <span className="text-[10.5px] font-semibold text-ink">{template.name}</span>
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 items-center justify-center rounded-full border",
                      active ? "border-forest bg-forest" : "border-line bg-white",
                    )}
                  >
                    {active && <Check className="h-2 w-2 text-cream" strokeWidth={3.5} />}
                  </span>
                </div>
                <span className="block px-0.5 pb-0.5 text-[8.5px] leading-3 text-muted">
                  {template.detail}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="field-label !mb-1.5">Spacing</p>
        <Segmented
          label="Spacing density"
          value={design.density}
          onChange={(value) => setDesign((prev) => ({ ...prev, density: value }))}
          options={[
            { value: "comfortable", label: "Comfortable", icon: <Rows3 className="h-3 w-3" /> },
            { value: "compact", label: "Compact", icon: <AlignJustify className="h-3 w-3" /> },
          ]}
        />
      </div>

      <div>
        <p className="field-label !mb-1.5">Font</p>
        <Segmented
          label="Font"
          value={design.font}
          onChange={(value) => setDesign((prev) => ({ ...prev, font: value }))}
          options={(Object.keys(FONTS) as (keyof typeof FONTS)[]).map((key) => ({
            value: key,
            label: FONTS[key].label,
          }))}
        />
      </div>

      <div>
        <p className="field-label !mb-1.5">Heading alignment</p>
        <Segmented
          label="Heading alignment"
          value={design.headingAlign}
          onChange={(value) => setDesign((prev) => ({ ...prev, headingAlign: value }))}
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
          ]}
        />
      </div>

      <div>
        <p className="field-label !mb-1.5">Skills layout</p>
        <Segmented
          label="Skills layout"
          value={design.skillsStyle}
          onChange={(value) => setDesign((prev) => ({ ...prev, skillsStyle: value }))}
          options={[
            { value: "comma", label: "One line" },
            { value: "bullets", label: "Bullet list" },
          ]}
        />
      </div>

      <div>
        <p className="field-label !mb-1.5">Paper size</p>
        <Segmented
          label="Paper size"
          value={design.paper}
          onChange={(value) => setDesign((prev) => ({ ...prev, paper: value }))}
          options={[
            { value: "letter", label: "US Letter", icon: <FileText className="h-3 w-3" /> },
            { value: "a4", label: "A4", icon: <FileText className="h-3 w-3" /> },
          ]}
        />
      </div>

      <div>
        <p className="field-label !mb-1">Visible sections</p>
        <div className="divide-y divide-line-soft">
          {sectionOptions.map((option) => (
            <Switch
              key={option.key}
              label={option.label}
              description={option.description}
              checked={design.visible[option.key]}
              onChange={(next) =>
                setDesign((prev) => ({
                  ...prev,
                  visible: { ...prev.visible, [option.key]: next },
                }))
              }
            />
          ))}
        </div>
      </div>

      <div>
        <p className="field-label !mb-1.5">Accent color</p>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(ACCENTS) as (keyof typeof ACCENTS)[]).map((key) => {
            const active = design.accent === key;
            return (
              <button
                key={key}
                type="button"
                aria-pressed={active}
                title={ACCENTS[key].label}
                onClick={() => setDesign((prev) => ({ ...prev, accent: key }))}
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
                  active ? "border-ink/40 ring-2 ring-ink/15" : "border-line hover:scale-105",
                )}
                style={{ backgroundColor: ACCENTS[key].hex }}
              >
                {active && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="field-label !mb-1.5">Section order</p>
        <div className="divide-y divide-line-soft rounded-xl border border-line">
          {design.sectionOrder.map((key, index) => {
            const option = sectionOptions.find((item) => item.key === key);
            if (!option) return null;
            return (
              <div key={key} className="flex items-center gap-2 px-2.5 py-1.5">
                <span className="min-w-0 flex-1 truncate text-[11px] text-ink-soft">
                  {option.label}
                  {!design.visible[key] && (
                    <span className="ml-1.5 font-mono text-[8px] uppercase tracking-wide text-[#9aa49b]">
                      hidden
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  className="icon-btn !h-6 !w-6"
                  aria-label={`Move ${option.label} up`}
                  disabled={index === 0}
                  onClick={() =>
                    setDesign((prev) => {
                      const next = [...prev.sectionOrder];
                      [next[index - 1], next[index]] = [next[index], next[index - 1]];
                      return { ...prev, sectionOrder: next };
                    })
                  }
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  className="icon-btn !h-6 !w-6"
                  aria-label={`Move ${option.label} down`}
                  disabled={index === design.sectionOrder.length - 1}
                  onClick={() =>
                    setDesign((prev) => {
                      const next = [...prev.sectionOrder];
                      [next[index + 1], next[index]] = [next[index], next[index + 1]];
                      return { ...prev, sectionOrder: next };
                    })
                  }
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-forest/15 bg-lime-soft/50 p-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-forest" />
          <p className="text-[11.5px] font-semibold text-forest">ATS-safe by design</p>
        </div>
        <ul className="mt-2 space-y-1.5">
          {[
            "One column — no sidebars or text boxes.",
            "Standard headings ATS software recognises.",
            "No icons, tables, charts or graphics.",
            "System fonts and selectable text on export.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-[10px] leading-[1.45] text-[#50634f]">
              <Check className="mt-[1px] h-2.5 w-2.5 shrink-0 text-forest" strokeWidth={3} />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
