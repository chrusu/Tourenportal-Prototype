import { X } from "lucide-react";
import type { TourFilterState } from "@/lib/filter";
import { formatDate } from "@/lib/format";
import { REGISTRATION_STATUS_OPTIONS } from "@/lib/status";

interface Chip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface ActiveFilterChipsProps {
  filters: TourFilterState;
  setFilters: (updater: (prev: TourFilterState) => TourFilterState) => void;
}

export function ActiveFilterChips({ filters, setFilters }: ActiveFilterChipsProps) {
  const chips: Chip[] = [];

  if (filters.dateFrom) {
    chips.push({
      key: "from",
      label: `Von ${formatDate(filters.dateFrom)}`,
      onRemove: () => setFilters((p) => ({ ...p, dateFrom: undefined })),
    });
  }
  if (filters.dateTo) {
    chips.push({
      key: "to",
      label: `Bis ${formatDate(filters.dateTo)}`,
      onRemove: () => setFilters((p) => ({ ...p, dateTo: undefined })),
    });
  }
  if (filters.fullTextSearch.trim()) {
    chips.push({
      key: "q",
      label: `„${filters.fullTextSearch}"`,
      onRemove: () => setFilters((p) => ({ ...p, fullTextSearch: "" })),
    });
  }
  filters.groups.forEach((g) =>
    chips.push({
      key: `g-${g}`,
      label: g,
      onRemove: () =>
        setFilters((p) => ({ ...p, groups: p.groups.filter((x) => x !== g) })),
    })
  );
  filters.tourTypes.forEach((t) =>
    chips.push({
      key: `t-${t}`,
      label: t,
      onRemove: () => {
        const { [t]: _removed, ...rest } = filters.difficultiesBySubType;
        setFilters((p) => ({
          ...p,
          tourTypes: p.tourTypes.filter((x) => x !== t),
          difficultiesBySubType: rest,
        }));
      },
    })
  );
  filters.experienceLevels.forEach((e) =>
    chips.push({
      key: `e-${e}`,
      label: e,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          experienceLevels: p.experienceLevels.filter((x) => x !== e),
        })),
    })
  );
  filters.physicalDifficulties.forEach((c) =>
    chips.push({
      key: `c-${c}`,
      label: `Kondition ${c}`,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          physicalDifficulties: p.physicalDifficulties.filter((x) => x !== c),
        })),
    })
  );
  filters.flags.forEach((flag) =>
    chips.push({
      key: `f-${flag}`,
      label: flag,
      onRemove: () =>
        setFilters((p) => ({ ...p, flags: p.flags.filter((x) => x !== flag) })),
    })
  );
  if (filters.leader) {
    chips.push({
      key: "leader",
      label: filters.leader,
      onRemove: () => setFilters((p) => ({ ...p, leader: undefined })),
    });
  }
  filters.registrationStatuses.forEach((s) => {
    const opt = REGISTRATION_STATUS_OPTIONS.find((o) => o.value === s);
    chips.push({
      key: `s-${s}`,
      label: opt?.label ?? s,
      onRemove: () =>
        setFilters((p) => ({
          ...p,
          registrationStatuses: p.registrationStatuses.filter((x) => x !== s),
        })),
    });
  });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="inline-flex items-center gap-1 rounded-full bg-sac-gray-light px-3 py-1 text-xs text-foreground transition-colors hover:bg-sac-gray"
        >
          {chip.label}
          <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}
