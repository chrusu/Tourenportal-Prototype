import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface CheckboxOptionProps {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  colorDot?: string;
  tooltip?: string;
}

export function CheckboxOption({
  label,
  checked,
  onCheckedChange,
  colorDot,
  tooltip,
}: CheckboxOptionProps) {
  const content = (
    <label className="group flex cursor-pointer items-center gap-2.5 px-1 py-1.5 hover:bg-sac-snow">
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
      <span className="text-sm text-sac-gray-dark transition-colors duration-[180ms] group-hover:text-sac-red">{label}</span>
    </label>
  );

  if (!tooltip) return content;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{tooltip}</TooltipContent>
    </Tooltip>
  );
}
