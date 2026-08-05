import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEasterEgg } from "@/contexts/EasterEggContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FavoriteButtonProps {
  tourId: string;
  className?: string;
  size?: "sm" | "md";
  /** "onColor" is used on the tour detail's colored header background. */
  variant?: "default" | "onColor";
}

/**
 * Heart toggle to favorite/unfavorite a tour. Requires the fake login;
 * clicking while logged out opens the login dialog instead of toggling.
 */
export function FavoriteButton({
  tourId,
  className,
  size = "md",
  variant = "default",
}: FavoriteButtonProps) {
  const { isAuthenticated, openLoginDialog } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { unlocked } = useEasterEgg();
  const active = isAuthenticated && isFavorite(tourId);
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  if (!unlocked) return null;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      openLoginDialog();
      return;
    }
    toggleFavorite(tourId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Von Favoriten entfernen" : "Zu Favoriten hinzufügen"}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full p-1.5 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sac-red/40",
        variant === "onColor"
          ? cn(
              "bg-white/20 text-white hover:bg-white/40",
              active && "bg-white text-sac-red hover:bg-white"
            )
          : cn("text-muted-foreground hover:text-sac-red", active && "text-sac-red"),
        className
      )}
    >
      <Heart className={cn(iconSize, active && "fill-current")} />
    </button>
  );
}
