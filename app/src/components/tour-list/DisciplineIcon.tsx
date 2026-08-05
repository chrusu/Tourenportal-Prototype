import { Bike, PersonStanding } from "lucide-react";
import type { DisciplineDef } from "@/lib/disciplines";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Fallback (lucide) icons for disciplines without a dedicated icon
// in the official SAC icon set (see styleguide "Icons" page).
const FALLBACK_ICONS: Record<string, typeof Bike> = {
  "Velo/Bike": Bike,
  Trailrunning: PersonStanding,
};

interface DisciplineIconProps {
  discipline: DisciplineDef;
  color: string;
  title?: string;
  /** "sm" for compact contexts like table rows; "md" (default) matches the card/detail badge. */
  size?: "sm" | "md";
}

/**
 * Renders the SAC icon for a single discipline (Sportart) inside a coloured
 * circle badge, matching the SAC destination/tour card styleguide.
 */
export function DisciplineIcon({ discipline, color, title, size = "md" }: DisciplineIconProps) {
  const Fallback = FALLBACK_ICONS[discipline.label];
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
  const icon = discipline.iconId ? (
    <svg className={iconSize} style={{ color }} fill="currentColor" aria-hidden>
      <use xlinkHref={`${import.meta.env.BASE_URL}icons/sac-discipline-sprite.svg#${discipline.iconId}`} />
    </svg>
  ) : Fallback ? (
    <Fallback className={iconSize} style={{ color }} aria-hidden />
  ) : null;

  if (!icon) return null;

  const badge = (
    <span
      className={
        size === "sm"
          ? "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white"
          : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white"
      }
      style={{ borderColor: color }}
      aria-label={title}
    >
      {icon}
    </span>
  );

  if (!title) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>{title}</TooltipContent>
    </Tooltip>
  );
}
