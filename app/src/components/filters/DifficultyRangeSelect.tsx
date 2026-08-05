import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import type { DifficultyScale } from "@/lib/scales";

interface DifficultyRangeSelectProps {
  /** All grades for this sub-type, in ascending difficulty order. */
  options: string[];
  /** Currently persisted selection. */
  value: string[];
  onChange: (grades: string[]) => void;
  /** Difficulty scale these grades belong to, used to build each grade's tooltip. */
  scale?: DifficultyScale;
}

/** Difficulty grade picker: each grade is toggled individually. */
export function DifficultyRangeSelect({ options, value, onChange, scale }: DifficultyRangeSelectProps) {
  const toggle = (grade: string) => {
    onChange(value.includes(grade) ? value.filter((g) => g !== grade) : [...value, grade]);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((grade) => {
        const isActive = value.includes(grade);
        const button = (
          <button
            type="button"
            onClick={() => toggle(grade)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex select-none items-center justify-center rounded-full border border-input bg-background px-2.5 py-1 text-xs font-light transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sac-red/40 focus-visible:ring-offset-1",
              isActive && "border-primary bg-primary font-bold text-primary-foreground"
            )}
          >
            {grade}
          </button>
        );

        if (!scale) return <div key={grade}>{button}</div>;

        const gradeLabel = scale.grades[grade];

        return (
          <Tooltip key={grade}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>
              <TooltipInfo
                title={gradeLabel ? `${grade} – ${gradeLabel}` : grade}
                items={[scale.name]}
              />
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
