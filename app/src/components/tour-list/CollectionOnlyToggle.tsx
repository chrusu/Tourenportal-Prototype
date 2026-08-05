import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface CollectionOnlyToggleProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  count: number;
  onToggle: (next: boolean) => void;
  className?: string;
}

/**
 * Generic "show only ..." toggle for a user-specific tour collection
 * (favorites, my activities, ...). Requires the fake login; clicking while
 * logged out opens the login dialog instead of toggling.
 */
export function CollectionOnlyToggle({
  icon,
  label,
  active,
  count,
  onToggle,
  className,
}: CollectionOnlyToggleProps) {
  const { isAuthenticated, openLoginDialog } = useAuth();
  const isActive = isAuthenticated && active;

  const handleClick = () => {
    if (!isAuthenticated) {
      openLoginDialog();
      return;
    }
    onToggle(!active);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      className={cn(
        "inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border border-sac-gray bg-white px-3 text-sm font-light text-sac-gray-dark transition-colors",
        "hover:border-sac-red-30 hover:text-sac-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sac-red/40",
        isActive && "border-sac-red text-sac-red",
        className
      )}
    >
      {icon}
      {label}
      {isAuthenticated && count > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sac-gray-light px-1.5 text-xs font-bold text-sac-gray-dark">
          {count}
        </span>
      )}
    </button>
  );
}
