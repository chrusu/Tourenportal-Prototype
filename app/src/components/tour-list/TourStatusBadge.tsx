import { Badge } from "@/components/ui/badge";
import type { Tour } from "@/types/tour";
import { registrationStatus, regStatusLabel } from "@/lib/status";

export function TourStatusBadge({ tour }: { tour: Tour }) {
  const status = registrationStatus(tour);
  return <Badge variant={status}>{regStatusLabel(status)}</Badge>;
}
