import { CheckCircle2, XCircle, AlertTriangle, Clock, CheckCheck, Ban } from "lucide-react";
import type { Tour } from "@/types/tour";
import { registrationStatus, regStatusLabel } from "@/lib/status";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const ICONS = {
  open: CheckCircle2,
  full: AlertTriangle,
  closed: XCircle,
  published: Clock,
  durchgefuehrt: CheckCheck,
  abgesagt: Ban,
} as const;

const COLORS = {
  open: "text-sac-green-hover",
  full: "text-sac-orange",
  closed: "text-sac-red",
  published: "text-sac-gray-dark",
  durchgefuehrt: "text-sac-gray-dark",
  abgesagt: "text-sac-red",
} as const;

export function TourStatusIcon({ tour }: { tour: Tour }) {
  const status = registrationStatus(tour);
  const Icon = ICONS[status];
  const label = regStatusLabel(status);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex" aria-label={label}>
          <Icon className={`h-5 w-5 ${COLORS[status]}`} />
        </span>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
