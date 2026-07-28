import { CheckCircle2, XCircle, AlertTriangle, Clock } from "lucide-react";
import type { Tour } from "@/types/tour";
import { registrationStatus, regStatusLabel } from "@/lib/status";

const ICONS = {
  open: CheckCircle2,
  full: AlertTriangle,
  closed: XCircle,
  published: Clock,
} as const;

const COLORS = {
  open: "text-sac-green-hover",
  full: "text-sac-orange",
  closed: "text-sac-red",
  published: "text-sac-gray-dark",
} as const;

export function TourStatusIcon({ tour }: { tour: Tour }) {
  const status = registrationStatus(tour);
  const Icon = ICONS[status];
  const label = regStatusLabel(status);
  return (
    <span title={label} aria-label={label} className="inline-flex">
      <Icon className={`h-5 w-5 ${COLORS[status]}`} />
    </span>
  );
}
