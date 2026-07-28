import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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

function rangeBetween(options: string[], a: string, b: string): string[] {
  const ia = options.indexOf(a);
  const ib = options.indexOf(b);
  if (ia === -1 || ib === -1) return [a];
  const [lo, hi] = ia <= ib ? [ia, ib] : [ib, ia];
  return options.slice(lo, hi + 1);
}

/**
 * Difficulty grade picker with range selection: click a first grade to start
 * a range, hover further grades to preview the range up to the pointer, and
 * click a second grade to commit the whole range as the active filter.
 * Clicking a single grade twice (or the same grade again) selects just that one.
 */
export function DifficultyRangeSelect({ options, value, onChange, scale }: DifficultyRangeSelectProps) {
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const previewing = rangeStart != null;
  const active = previewing ? rangeBetween(options, rangeStart, hovered ?? rangeStart) : value;

  const handleClick = (grade: string) => {
    if (!rangeStart) {
      setRangeStart(grade);
      setHovered(grade);
    } else {
      onChange(rangeBetween(options, rangeStart, grade));
      setRangeStart(null);
      setHovered(null);
    }
  };

  return (
    <div
      className="flex flex-wrap gap-1.5"
      onMouseLeave={() => previewing && setHovered(rangeStart)}
    >
      {options.map((grade) => {
        const isActive = active.includes(grade);
        const button = (
          <button
            type="button"
            onClick={() => handleClick(grade)}
            onMouseEnter={() => previewing && setHovered(grade)}
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
        const tooltip = gradeLabel ? `${grade} – ${gradeLabel} (${scale.name})` : `${grade} – ${scale.name}`;

        return (
          <Tooltip key={grade}>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
