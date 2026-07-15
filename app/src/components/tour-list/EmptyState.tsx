import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-white py-16 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground" />
      <div>
        <p className="text-sac-h4">Keine Touren gefunden</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Passe deine Filter an oder setze sie zurück.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onReset}>
        Filter zurücksetzen
      </Button>
    </div>
  );
}
