import { Tag } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { FLAG_CATEGORIES } from "@/lib/flags";

interface FlagFilterProps {
  selected: string[];
  onChange: (flags: string[]) => void;
}

export function FlagFilter({ selected, onChange }: FlagFilterProps) {
  const toggle = (flag: string, checked: boolean) => {
    onChange(checked ? [...selected, flag] : selected.filter((f) => f !== flag));
  };

  return (
    <FilterPopover
      label="Merkmale"
      icon={<Tag className="h-4 w-4 text-muted-foreground" />}
      count={selected.length}
      onReset={() => onChange([])}
    >
      <div className="flex max-h-[26rem] flex-col overflow-y-auto">
        {FLAG_CATEGORIES.map((cat, ci) => (
          <div
            key={cat.label}
            className={ci > 0 ? "mt-1.5 border-t border-sac-gray pt-1.5" : ""}
          >
            <span className="px-1 py-1 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {cat.label}
            </span>
            <div className="mt-0.5 flex flex-col">
              {cat.flags.map((flag) => (
                <label
                  key={flag}
                  className="group flex cursor-pointer items-center gap-2.5 px-1 py-1 hover:bg-sac-snow"
                >
                  <Checkbox
                    checked={selected.includes(flag)}
                    onCheckedChange={(v) => toggle(flag, v === true)}
                  />
                  <span className="text-sm text-sac-gray-dark transition-colors duration-[180ms] group-hover:text-sac-red">
                    {flag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </FilterPopover>
  );
}
