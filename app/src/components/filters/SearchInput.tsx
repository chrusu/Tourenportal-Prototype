import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative min-w-[16rem] flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sac-gray-medium" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Nach Aktivitätstitel, Beschreibung, Typ, etc. suchen"
        aria-label="Aktivitäten durchsuchen"
        className="h-[50px] pl-9"
      />
    </div>
  );
}
