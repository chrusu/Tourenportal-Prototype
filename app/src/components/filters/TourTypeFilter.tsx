import { Mountain } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DISCIPLINES } from "@/lib/disciplines";

interface TourTypeFilterProps {
  selectedTypes: string[];
  difficultiesByDiscipline: Record<string, string[]>;
  onChangeTypes: (types: string[]) => void;
  onChangeDifficulties: (map: Record<string, string[]>) => void;
}

export function TourTypeFilter({
  selectedTypes,
  difficultiesByDiscipline,
  onChangeTypes,
  onChangeDifficulties,
}: TourTypeFilterProps) {
  const isDisciplineSelected = (matches: string[]) =>
    matches.some((m) => selectedTypes.includes(m));

  const toggleDiscipline = (matches: string[], label: string, checked: boolean) => {
    if (checked) {
      const next = new Set(selectedTypes);
      matches.forEach((m) => next.add(m));
      onChangeTypes([...next]);
    } else {
      onChangeTypes(selectedTypes.filter((t) => !matches.includes(t)));
      // also clear difficulties for this discipline
      const { [label]: _removed, ...rest } = difficultiesByDiscipline;
      onChangeDifficulties(rest);
    }
  };

  const setDifficulties = (label: string, grades: string[]) => {
    onChangeDifficulties({ ...difficultiesByDiscipline, [label]: grades });
  };

  const reset = () => {
    onChangeTypes([]);
    onChangeDifficulties({});
  };

  return (
    <FilterPopover
      label="Tourentyp"
      icon={<Mountain className="h-4 w-4 text-muted-foreground" />}
      count={selectedTypes.length}
      onReset={reset}
    >
      <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
        {DISCIPLINES.map((d) => {
          const selected = isDisciplineSelected(d.matches);
          return (
            <div key={d.label}>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-accent">
                <Checkbox
                  checked={selected}
                  onCheckedChange={(v) =>
                    toggleDiscipline(d.matches, d.label, v === true)
                  }
                />
                <span
                  className="h-3 w-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: d.color }}
                  aria-hidden
                />
                <span className="text-sm font-light">{d.label}</span>
              </label>

              {selected && d.difficulties.length > 0 && (
                <div className="mb-1 ml-8 mt-1">
                  <ToggleGroup
                    type="multiple"
                    value={difficultiesByDiscipline[d.label] ?? []}
                    onValueChange={(v) => setDifficulties(d.label, v)}
                  >
                    {d.difficulties.map((grade) => (
                      <ToggleGroupItem key={grade} value={grade}>
                        {grade}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </FilterPopover>
  );
}
