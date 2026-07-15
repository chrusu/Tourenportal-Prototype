import * as React from "react";
import { FilterPopover } from "./FilterPopover";
import { CheckboxOption } from "./CheckboxOption";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectFilterProps {
  label: string;
  icon?: React.ReactNode;
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export function MultiSelectFilter({
  label,
  icon,
  options,
  selected,
  onChange,
}: MultiSelectFilterProps) {
  const toggle = (value: string, checked: boolean) => {
    onChange(
      checked ? [...selected, value] : selected.filter((v) => v !== value)
    );
  };

  return (
    <FilterPopover
      label={label}
      icon={icon}
      count={selected.length}
      onReset={() => onChange([])}
    >
      <div className="flex flex-col">
        {options.map((opt) => (
          <CheckboxOption
            key={opt.value}
            label={opt.label}
            checked={selected.includes(opt.value)}
            onCheckedChange={(c) => toggle(opt.value, c)}
          />
        ))}
      </div>
    </FilterPopover>
  );
}
