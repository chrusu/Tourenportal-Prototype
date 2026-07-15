export function ResultsSummary({ count }: { count: number }) {
  return (
    <p className="text-sac-h4" aria-live="polite">
      {count} {count === 1 ? "Tour" : "Touren"} gefunden
    </p>
  );
}
