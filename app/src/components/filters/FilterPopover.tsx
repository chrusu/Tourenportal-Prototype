import * as React from "react";
import { ChevronDown, RotateCcw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FilterPopoverProps {
  label: string;
  icon?: React.ReactNode;
  /** Number of active selections shown as a badge on the trigger. */
  count?: number;
  onReset?: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared trigger + popover shell used by every horizontal filter.
 * Includes a footer "reset this filter" action per umsetzungsplan.md.
 */
export function FilterPopover({
  label,
  icon,
  count = 0,
  onReset,
  children,
  className,
}: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-[state=open]:border-primary",
          className
        )}
        aria-label={label}
      >
        {icon}
        <span className="font-light">{label}</span>
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
            {count}
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sac-h4">{label}</p>
          {onReset && count > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" />
              Zurücksetzen
            </button>
          )}
        </div>
        {children}
      </PopoverContent>
    </Popover>
  );
}
