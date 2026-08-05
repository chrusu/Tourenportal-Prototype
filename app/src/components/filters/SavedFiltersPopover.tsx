import { useState, type MouseEvent } from "react";
import { Bookmark, Save, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedFilters } from "@/contexts/SavedFiltersContext";
import { countActiveFilters, type TourFilterState } from "@/lib/filter";
import { cn } from "@/lib/utils";

interface SavedFiltersPopoverProps {
  filters: TourFilterState;
  onApply: (filters: TourFilterState) => void;
}

/**
 * Lets logged-in users save the currently active filter combination under a
 * name (e.g. "Skitouren WS-S") and re-apply or delete it later. Requires the
 * fake login; opening the popover while logged out opens the login dialog.
 */
export function SavedFiltersPopover({ filters, onApply }: SavedFiltersPopoverProps) {
  const { isAuthenticated, openLoginDialog } = useAuth();
  const { savedFilters, saveFilter, deleteFilter } = useSavedFilters();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const activeCount = countActiveFilters(filters);

  const handleTriggerClick = (e: MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openLoginDialog();
    }
  };

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    saveFilter(trimmed, filters);
    setName("");
  };

  return (
    <Popover open={isAuthenticated && open} onOpenChange={setOpen}>
      <PopoverTrigger
        onClick={handleTriggerClick}
        className={cn(
          "inline-flex h-10 items-center gap-2 border border-sac-gray bg-white px-3 text-sm",
          "transition-[border-color,background-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0,0,0.2,1)]",
          "hover:border-sac-gray-dark focus-visible:outline-none focus-visible:border-sac-red focus-visible:ring-2 focus-visible:ring-sac-red/40",
          "data-[state=open]:border-sac-red"
        )}
        aria-label="Gespeicherte Filter"
      >
        <Bookmark className="h-4 w-4 text-muted-foreground" />
        <span className="font-light">Gespeicherte Filter</span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <p className="mb-3 text-sac-h4">Gespeicherte Filter</p>

        {savedFilters.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Noch keine Filter gespeichert.
          </p>
        ) : (
          <div className="mb-3 flex max-h-60 flex-col gap-0.5 overflow-y-auto">
            {savedFilters.map((f) => (
              <div
                key={f.id}
                className="group flex items-center justify-between gap-2 rounded-md px-1 py-1.5 hover:bg-sac-snow"
              >
                <button
                  type="button"
                  onClick={() => {
                    onApply(f.filters);
                    setOpen(false);
                  }}
                  className="min-w-0 flex-1 truncate text-left text-sm text-sac-gray-dark group-hover:text-sac-red"
                >
                  {f.name}
                </button>
                <button
                  type="button"
                  onClick={() => deleteFilter(f.id)}
                  aria-label={`"${f.name}" löschen`}
                  className="shrink-0 text-muted-foreground hover:text-sac-red"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 border-t pt-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name für aktuelle Filter"
            className="h-9 text-sm"
            disabled={activeCount === 0}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={activeCount === 0 || !name.trim()}
            aria-label="Aktuelle Filter speichern"
          >
            <Save className="h-4 w-4" />
          </Button>
        </div>
        {activeCount === 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Passe zuerst die Filter an, um sie zu speichern.
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
