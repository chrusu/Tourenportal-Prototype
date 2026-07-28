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
}

/**
 * Renders the SAC icon for a single discipline (Sportart) inside a coloured
 * circle badge, matching the SAC destination/tour card styleguide.
 */
export function DisciplineIcon({ discipline, color, title }: DisciplineIconProps) {
  const Fallback = FALLBACK_ICONS[discipline.label];
  const icon = discipline.iconId ? (
    <svg className="h-4 w-4" style={{ color }} fill="currentColor" aria-hidden>
      <use xlinkHref={`${import.meta.env.BASE_URL}icons/sac-discipline-sprite.svg#${discipline.iconId}`} />
    </svg>
  ) : Fallback ? (
    <Fallback className="h-4 w-4" style={{ color }} aria-hidden />
  ) : null;

  if (!icon) return null;

  const badge = (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 bg-white"
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
