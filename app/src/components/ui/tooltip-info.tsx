interface TooltipInfoProps {
  title: string;
  items: string[];
}

/**
 * Structured tooltip body: bold title followed by one or more detail lines,
 * used for tooltips that explain a grade/range (Kondition, Schwierigkeit,
 * etc.) instead of cramming everything into a single run-on sentence.
 */
export function TooltipInfo({ title, items }: TooltipInfoProps) {
  return (
    <div className="flex flex-col gap-1 py-0.5">
      <p className="font-bold text-sac-black">{title}</p>
      {items.length > 0 &&
        (items.length > 1 ? (
          <ul className="flex flex-col gap-1">
            {items.map((item) => (
              <li key={item} className="text-sac-gray-dark">
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sac-gray-dark">{items[0]}</p>
        ))}
    </div>
  );
}
