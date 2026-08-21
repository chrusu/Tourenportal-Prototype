import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { TooltipInfo } from "@/components/ui/tooltip-info";
import type { DifficultyScale } from "@/lib/scales";

interface DifficultyRangeSelectProps {
  /** All grades for this sub-type, in ascending difficulty order. */
  options: string[];
  /** Currently persisted selection. */
  value: string[];
  onChange: (grades: string[]) => void;
  /** Difficulty scale these grades belong to, used to build each grade's tooltip. */
  scale?: DifficultyScale;
}

const TICK_WIDTH_REM = 0.85;
const TICK_WIDTH_FEW_REM = 1.6; // wider spacing for ≤4 elements
/** Height reserved above the track for the (vertical) grade labels, in px. */
const LABEL_AREA_HEIGHT = 40;
/** Vertical center of the track, in px from the top of the flex row (label height + gap-1.5=6px + half-dot=3px). */
const TRACK_Y = LABEL_AREA_HEIGHT + 6 + 3;

/**
 * Difficulty grade picker styled as a range slider: the lowest and highest
 * grade are always shown prominently, grades in between are subtler, and
 * the selected range is highlighted along a connecting track.
 *
 * - Click a grade to start a selection ("selection mode"): the anchor is
 *   highlighted with a pulsing ring, and hovering previews the range that a
 *   second click would produce. Click again to confirm it.
 * - Once a range is confirmed, its start/end become draggable handles that
 *   can be dragged directly to adjust the range.
 * - Clicking anywhere else afterwards starts a new selection.
 */
export function DifficultyRangeSelect({ options, value, onChange, scale }: DifficultyRangeSelectProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const justDraggedRef = useRef(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  if (options.length === 0) return null;

  const tickWidth = options.length <= 4 ? TICK_WIDTH_FEW_REM : TICK_WIDTH_REM;

  const indexOf = (g: string) => options.indexOf(g);
  const selectedIndices = value.map(indexOf).filter((i) => i >= 0);
  const minIndex = selectedIndices.length ? Math.min(...selectedIndices) : -1;
  const maxIndex = selectedIndices.length ? Math.max(...selectedIndices) : -1;
  const lastIndex = options.length - 1;
  const isRange = value.length > 1 && minIndex >= 0;
  const isSelecting = value.length === 1 && minIndex >= 0;

  const previewIndex = isSelecting && !dragging ? hoverIndex : null;
  const previewMin = previewIndex !== null ? Math.min(minIndex, previewIndex) : null;
  const previewMax = previewIndex !== null ? Math.max(minIndex, previewIndex) : null;

  // Position as % of the flex row width, where each tick occupies tickWidth and the
  // circle sits at the tick center. Computed after tickWidth is known.
  const percent = (i: number) => ((i + 0.5) / options.length) * 100;

  const indexFromClientX = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const fraction = (clientX - rect.left) / rect.width;
    return Math.min(lastIndex, Math.max(0, Math.round(fraction * options.length - 0.5)));
  };

  const handleClick = (grade: string) => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    const idx = indexOf(grade);
    if (isSelecting) {
      const [from, to] = minIndex <= idx ? [minIndex, idx] : [idx, minIndex];
      // Confirm as a range (even if from === to — single-value range is valid)
      onChange(from === to ? [grade, grade] : options.slice(from, to + 1));
      setHoverIndex(null);
    } else {
      onChange([grade]);
    }
  };

  const startDrag = (which: "min" | "max") => (e: React.PointerEvent) => {
    e.stopPropagation();
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(which);
  };

  const handleTrackPointerMove = (e: React.PointerEvent) => {
    if (dragging === "min") {
      justDraggedRef.current = true;
      const idx = indexFromClientX(e.clientX);
      onChange(options.slice(Math.min(idx, maxIndex), maxIndex + 1));
    } else if (dragging === "max") {
      justDraggedRef.current = true;
      const idx = indexFromClientX(e.clientX);
      onChange(options.slice(minIndex, Math.max(idx, minIndex) + 1));
    } else if (isSelecting) {
      setHoverIndex(indexFromClientX(e.clientX));
    }
  };

  const handleTrackPointerUp = () => setDragging(null);
  const handleTrackPointerLeave = () => {
    if (!dragging) setHoverIndex(null);
  };

  return (
    <div className="py-1">
      {isSelecting && (
        <p className="mb-1.5 animate-pulse text-[10px] font-bold uppercase tracking-wide text-sac-red">
          Zweiten Wert wählen …
        </p>
      )}
      <div className="overflow-x-auto" style={{ overflowY: "visible" }}>
        <div
          ref={trackRef}
          className="py-2"
          style={{ width: `${options.length * tickWidth}rem` }}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerLeave={handleTrackPointerLeave}
        >
          <div className="relative flex">
          {/* Base track — spans between centers of first and last tick */}
          <div
            className="absolute h-px bg-sac-gray"
            style={{ top: TRACK_Y, left: `${percent(0)}%`, right: `${100 - percent(lastIndex)}%` }}
          />
          {/* Confirmed selected range */}
          {minIndex >= 0 && (
            <div
              className="absolute h-px bg-sac-red"
              style={{ top: TRACK_Y, left: `${percent(minIndex)}%`, right: `${100 - percent(maxIndex)}%` }}
            />
          )}
          {/* Preview of the range a second click would confirm */}
          {previewMin !== null && previewMax !== null && (
            <div
              className="absolute h-px border-t border-dashed border-sac-red/50"
              style={{ top: TRACK_Y, left: `${percent(previewMin)}%`, right: `${100 - percent(previewMax)}%` }}
            />
          )}

          {/* Draggable handles for a confirmed range */}
          {isRange && (
            <>
              <button
                type="button"
                aria-label={`Von ${options[minIndex]}`}
                onPointerDown={startDrag("min")}
                className={cn(
                  "absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
                  "rounded-full border-2 border-white bg-sac-red shadow ring-1 ring-sac-red/40"
                )}
                style={{ top: TRACK_Y, left: `${percent(minIndex)}%` }}
              />
              <button
                type="button"
                aria-label={`Bis ${options[maxIndex]}`}
                onPointerDown={startDrag("max")}
                className={cn(
                  "absolute z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
                  "rounded-full border-2 border-white bg-sac-red shadow ring-1 ring-sac-red/40"
                )}
                style={{ top: TRACK_Y, left: `${percent(maxIndex)}%` }}
              />
            </>
          )}
            {options.map((grade, i) => {
              const isEdgeLabel = i === 0 || i === lastIndex;
              const isHandlePos = isRange && (i === minIndex || i === maxIndex);
              const isInteriorSelected = isRange && i > minIndex && i < maxIndex;
              const isAnchor = isSelecting && i === minIndex;
              const isPreview =
                previewMin !== null && previewMax !== null && i >= previewMin && i <= previewMax && i !== minIndex;
              const gradeLabel = scale?.grades[grade];

              const tick = (
                <button
                  type="button"
                  onClick={() => handleClick(grade)}
                  aria-pressed={isRange ? i >= minIndex && i <= maxIndex : isAnchor}
                  aria-label={grade}
                  className="group flex flex-col items-center gap-1.5 focus-visible:outline-none"
                  style={{ width: `${tickWidth}rem` }}
                >
                  <div
                    className="flex items-end justify-center"
                    style={{ height: LABEL_AREA_HEIGHT }}
                  >
                    <span
                      className={cn(
                        "whitespace-nowrap [writing-mode:vertical-lr] rotate-180 text-muted-foreground transition-colors",
                        isEdgeLabel ? "text-xs font-bold" : "text-[9px]",
                        (isAnchor || isInteriorSelected || isHandlePos) && "font-bold text-sac-red",
                        isEdgeLabel && !isAnchor && !isInteriorSelected && !isHandlePos && "text-foreground"
                      )}
                    >
                      {grade}
                    </span>
                  </div>
                  {isHandlePos ? (
                    // The draggable handle overlay already marks this position.
                    <span className="h-1.5 w-1.5 shrink-0" />
                  ) : (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full border bg-white transition-colors",
                        isAnchor && "border-sac-red bg-sac-red ring-2 ring-sac-red/40 ring-offset-1",
                        isInteriorSelected && "border-sac-red/40 bg-sac-red/40",
                        isPreview && !isInteriorSelected && "border-sac-red border-dashed bg-sac-red/20",
                        !isAnchor &&
                          !isInteriorSelected &&
                          !isPreview &&
                          "border-sac-gray-medium group-hover:border-sac-red-30"
                      )}
                    />
                  )}
                </button>
              );

              if (!scale) return <div key={grade}>{tick}</div>;

              return (
                <Tooltip key={grade}>
                  <TooltipTrigger asChild>{tick}</TooltipTrigger>
                  <TooltipContent>
                    <TooltipInfo title={gradeLabel ? `${grade} – ${gradeLabel}` : grade} items={[scale.name]} />
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
