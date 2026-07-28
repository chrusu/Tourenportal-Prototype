import { disciplinesFor } from "@/lib/disciplines";
import { DisciplineIcon } from "./DisciplineIcon";

interface TourDisciplineIconsProps {
  tourType: string[];
  className?: string;
}

/**
 * Renders one icon per distinct sport (discipline, "Aktivität") involved in a tour.
 * Icons always use the official discipline colour (matching the "Aktivitäten" filter),
 * regardless of any per-tour colour override.
 */
export function TourDisciplineIcons({ tourType, className }: TourDisciplineIconsProps) {
  const matches = disciplinesFor(tourType);
  if (matches.length === 0) return null;

  return (
    <span className={className ?? "inline-flex items-center gap-1.5"}>
      {matches.map(({ discipline, subTypeLabels }) => (
        <DisciplineIcon
          key={discipline.label}
          discipline={discipline}
          color={discipline.color}
          title={`${discipline.label} (${subTypeLabels.join(", ")})`}
        />
      ))}
    </span>
  );
}
