import { Badge } from "@/components/ui/badge";
import type { TourStatus } from "@/types/tour";
import { statusLabel, statusVariant } from "@/lib/status";

export function TourStatusBadge({ status }: { status: TourStatus }) {
  const variant = statusVariant(status);
  return <Badge variant={variant}>{statusLabel(status)}</Badge>;
}
