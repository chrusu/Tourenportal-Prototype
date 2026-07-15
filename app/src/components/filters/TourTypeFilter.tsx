import type { CheckedState } from "@radix-ui/react-checkbox";
import { Mountain } from "lucide-react";
import { FilterPopover } from "./FilterPopover";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DISCIPLINES } from "@/lib/disciplines";

interface TourTypeFilterProps {
  selectedTypes: string[];
  difficultiesBySubType: Record<string, string[]>;
  onChangeTypes: (types: string[]) => void;
  onChangeDifficulties: (map: Record<string, string[]>) => void;
}

export function TourTypeFilter({
  selectedTypes,
  difficultiesBySubType,
  onChangeTypes,
  onChangeDifficulties,
}: TourTypeFilterProps) {
  const toggleHauptKategorie = (subTypeLabels: string[], state: CheckedState) => {
    if (state === true) {
      const next = new Set(selectedTypes);
      subTypeLabels.forEach((l) => next.add(l));
      onChangeTypes([...next]);
    } else {
      onChangeTypes(selectedTypes.filter((t) => !subTypeLabels.includes(t)));
      const next = { ...difficultiesBySubType };
      subTypeLabels.forEach((l) => delete next[l]);
      onChangeDifficulties(next);
    }
  };

  const toggleSubType = (label: string, checked: boolean) => {
    if (checked) {
      onChangeTypes([...selectedTypes, label]);
    } else {
      onChangeTypes(selectedTypes.filter((t) => t !== label));
      const { [label]: _removed, ...rest } = difficultiesBySubType;
      onChangeDifficulties(rest);
    }
  };

  const setGrades = (label: string, grades: string[]) =>
    onChangeDifficulties({ ...difficultiesBySubType, [label]: grades });

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
      <div className="flex max-h-[26rem] flex-col overflow-y-auto">
        {DISCIPLINES.map((d, di) => {
          const subLabels = d.subTypes.map((s) => s.label);
          const selectedSubs = subLabels.filter((l) => selectedTypes.includes(l));
          const allSelected = selectedSubs.length === subLabels.length;
          const someSelected = selectedSubs.length > 0 && !allSelected;
          const mainState: CheckedState = allSelected
            ? true
            : someSelected
              ? "indeterminate"
              : false;

          return (
            <div
              key={d.label}
              className={di > 0 ? "mt-1.5 border-t border-sac-gray pt-1.5" : ""}
            >
              {/* ── Hauptkategorie ── */}
              <label className="group flex cursor-pointer items-center gap-2.5 px-1 py-1.5 hover:bg-sac-snow">
                <Checkbox
                  checked={mainState}
                  onCheckedChange={(v) => toggleHauptKategorie(subLabels, v)}
                />
                <span
                  className="h-3 w-3 shrink-0"
                  style={{ backgroundColor: d.color }}
                  aria-hidden
                />
                <span className="text-sm font-bold text-sac-black transition-colors duration-[180ms] group-hover:text-sac-red">
                  {d.label}
                </span>
              </label>

              {/* ── Unterkategorien ── */}
              <div className="ml-7 flex flex-col">
                {d.subTypes.map((st) => {
                  const isSelected = selectedTypes.includes(st.label);
                  return (
                    <div key={st.label}>
                      <label className="group flex cursor-pointer items-center gap-2.5 px-1 py-1 hover:bg-sac-snow">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(v) => toggleSubType(st.label, v === true)}
                        />
                        <span className="text-sm text-sac-gray-dark transition-colors duration-[180ms] group-hover:text-sac-red">
                          {st.label}
                        </span>
                      </label>

                      {/* Per-sub-type difficulty chips */}
                      {isSelected && st.difficulties.length > 0 && (
                        <div className="mb-1 ml-6 mt-0.5">
                          <ToggleGroup
                            type="multiple"
                            value={difficultiesBySubType[st.label] ?? []}
                            onValueChange={(v) => setGrades(st.label, v)}
                          >
                            {st.difficulties.map((grade) => (
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
            </div>
          );
        })}
      </div>
    </FilterPopover>
  );
}
