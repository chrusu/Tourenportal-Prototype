import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Tour } from "@/types/tour";
import { cn } from "@/lib/utils";

const VARIANT_STYLES = {
  green: "border-t border-sac-green/30 bg-sac-green/10 text-sac-green-hover",
  orange: "border-t border-sac-orange/30 bg-sac-orange/10 text-sac-orange",
} as const;

const VARIANT_ICONS = {
  green: CheckCircle2,
  orange: AlertTriangle,
} as const;

/** Full-width, color-coded call-out banner for a tour's free-text note. */
export function TourNote({ tour }: { tour: Tour }) {
  if (!tour.note) return null;
  const { text, variant } = tour.note;
  const Icon = VARIANT_ICONS[variant];

  return (
    <p className={cn("flex items-center gap-2 px-5 py-2.5 text-sm font-bold", VARIANT_STYLES[variant])}>
      <Icon className="h-4 w-4 shrink-0" />
      {text}
    </p>
  );
}
