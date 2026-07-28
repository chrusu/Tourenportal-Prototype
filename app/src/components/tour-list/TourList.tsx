import type { Tour } from "@/types/tour";
import { TourCard } from "./TourCard";
import { EmptyState } from "./EmptyState";

interface TourListProps {
  tours: Tour[];
  onReset: () => void;
}

export function TourList({ tours, onReset }: TourListProps) {
  if (tours.length === 0) {
    return <EmptyState onReset={onReset} />;
  }

  return (
    <div className="flex flex-col gap-4">
      {tours.map((tour) => (
        <TourCard key={tour.id} tour={tour} />
      ))}
    </div>
  );
}
