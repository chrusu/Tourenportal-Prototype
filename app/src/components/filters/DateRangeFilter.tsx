import { DateInputField } from "./DateInputField";

interface DateRangeFilterProps {
  from?: string;
  to?: string;
  onChange: (range: { from?: string; to?: string }) => void;
}

export function DateRangeFilter({ from, to, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <DateInputField
        id="date-from"
        label="Von"
        value={from ?? ""}
        onChange={(v) => onChange({ from: v || undefined, to })}
        className="w-40"
      />
      <DateInputField
        id="date-to"
        label="Bis"
        value={to ?? ""}
        onChange={(v) => onChange({ from, to: v || undefined })}
        className="w-40"
      />
    </div>
  );
}
