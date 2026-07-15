import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  colorDot?: string;
}

export function CheckboxOption({
  label,
  checked,
  onCheckedChange,
  colorDot,
}: CheckboxOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 rounded-md px-1 py-1.5 hover:bg-accent">
      <Checkbox
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
      />
      {colorDot && (
        <span
          className="h-3 w-3 shrink-0 rounded-full"
          style={{ backgroundColor: colorDot }}
          aria-hidden
        />
      )}
      <span className="text-sm font-light">{label}</span>
    </label>
  );
}
