import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";

export function UserMenu() {
  const { user, isAuthenticated, logout, openLoginDialog } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <Button variant="outline" size="sm" onClick={openLoginDialog}>
        <LogIn className="h-4 w-4" /> Anmelden
      </Button>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex items-center gap-2 rounded-full border border-sac-gray bg-white py-1 pl-1 pr-3 text-sm transition-colors hover:border-sac-gray-dark focus-visible:outline-none focus-visible:border-sac-red focus-visible:ring-2 focus-visible:ring-sac-red/40 data-[state=open]:border-sac-red"
        aria-label="Benutzermenü"
      >
        <img
          src={user.avatarUrl}
          alt={user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="hidden font-light text-sac-black sm:inline">{user.name}</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56">
        <div className="mb-2">
          <p className="font-bold text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-sac-snow hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Abmelden
        </button>
      </PopoverContent>
    </Popover>
  );
}
