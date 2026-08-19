import type { ReactElement } from "react";
import type { Tour } from "@/types/tour";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import { useAuth } from "@/contexts/AuthContext";
import { useEasterEgg } from "@/contexts/EasterEggContext";
import { participantNames, shortName } from "@/lib/participants";

/**
 * Wraps the "Plätze"/participants indicator with a tooltip listing who's
 * registered — but only for logged-in users with the easter egg unlocked,
 * and only first name + last initial (e.g. "Tobias H."), never full names.
 */
export function ParticipantsTooltip({ tour, children }: { tour: Tour; children: ReactElement }) {
  const { isAuthenticated } = useAuth();
  const { unlocked } = useEasterEgg();
  const names = isAuthenticated && unlocked ? participantNames(tour) : undefined;

  if (!names || names.length === 0) return <>{children}</>;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <TooltipInfo title="Teilnehmende" items={names.map(shortName)} />
      </TooltipContent>
    </Tooltip>
  );
}
