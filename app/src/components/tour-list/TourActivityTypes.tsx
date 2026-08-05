import { disciplineForType } from "@/lib/disciplines";
import { DisciplineIcon } from "./DisciplineIcon";

interface TourActivityTypesProps {
  tourType: string[];
  className?: string;
  size?: "sm" | "md";
}

/**
 * Renders every activity type of a tour (e.g. "Alpinklettern", "Hochtouren"),
 * each with its discipline icon and label — instead of only the first/main
 * one — so multi-discipline tours are fully visible in list and table view.
 */
export function TourActivityTypes({ tourType, className, size = "md" }: TourActivityTypesProps) {
  const labels = [...new Set(tourType)];
  if (labels.length === 0) return null;

  return (
    <div className={className ?? "flex flex-wrap items-center gap-x-3 gap-y-1"}>
      {labels.map((label) => {
        const discipline = disciplineForType(label);
        return (
          <span key={label} className="inline-flex items-center gap-1.5">
            {discipline && (
              <DisciplineIcon discipline={discipline} color={discipline.color} title={discipline.label} size={size} />
            )}
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: discipline?.color }}>
              {label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
