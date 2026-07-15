import { User } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { cn } from "@/lib/utils";

interface LeaderFilterProps {
  leaders: string[];
  selected?: string;
  onChange: (leader?: string) => void;
}

export function LeaderFilter({ leaders, selected, onChange }: LeaderFilterProps) {
  return (
    <FilterPopover
      label={selected ?? "Tourenleiter"}
      icon={<User className="h-4 w-4 text-muted-foreground" />}
      count={selected ? 1 : 0}
      onReset={() => onChange(undefined)}
    >
      <div className="flex max-h-80 flex-col overflow-y-auto">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={cn(
            "rounded-md px-2 py-1.5 text-left text-sm font-light hover:bg-accent",
            !selected && "bg-accent font-bold"
          )}
        >
          Alle Tourenleiter
        </button>
        {leaders.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "rounded-md px-2 py-1.5 text-left text-sm font-light hover:bg-accent",
              selected === name && "bg-accent font-bold"
            )}
          >
            {name}
          </button>
        ))}
      </div>
    </FilterPopover>
  );
}
