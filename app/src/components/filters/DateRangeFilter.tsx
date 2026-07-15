import { Input } from "@/components/ui/input";

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="date-from" className="text-xs font-bold text-sac-black">
          Von
        </label>
        <Input
          id="date-from"
          type="date"
          value={from ?? ""}
          onChange={(e) => onChange({ from: e.target.value || undefined, to })}
          className="w-40"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="date-to" className="text-xs font-bold text-sac-black">
          Bis
        </label>
        <Input
          id="date-to"
          type="date"
          value={to ?? ""}
          onChange={(e) => onChange({ from, to: e.target.value || undefined })}
          className="w-40"
        />
      </div>
    </div>
  );
}
