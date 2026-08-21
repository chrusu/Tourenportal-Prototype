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
  /** Overrides the popover content's default width ("w-80"). */
  contentClassName?: string;
  /** Render as an inline collapsible instead of a floating popover (e.g. inside a Sheet). */
  inline?: boolean;
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
  contentClassName,
  inline = false,
}: FilterPopoverProps) {
  const [open, setOpen] = React.useState(false);

  if (inline) {
    return (
      <div className="border border-sac-gray">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2.5 text-sm",
            "transition-colors hover:bg-sac-snow",
            className
          )}
        >
          {icon}
          <span className="font-light">{label}</span>
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
              {count}
            </span>
          )}
          <ChevronDown
            className={cn("ml-auto h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </button>
        {open && (
          <div className="border-t border-sac-gray px-3 py-3">
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
          </div>
        )}
      </div>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "inline-flex h-10 items-center gap-2 border border-sac-gray bg-white px-3 text-sm",
          "transition-[border-color,background-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0,0,0.2,1)]",
          "hover:border-sac-gray-dark focus-visible:outline-none focus-visible:border-sac-red focus-visible:ring-2 focus-visible:ring-sac-red/40",
          "data-[state=open]:border-sac-red",
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
      <PopoverContent
        className={cn("w-80 max-w-[calc(100vw-1rem)]", contentClassName)}
        collisionPadding={8}
      >
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
