import { useEffect, useRef, useState } from "react";
import { format, isValid, parse } from "date-fns";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

interface DateInputFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const DISPLAY_FORMAT = "dd.MM.yyyy";

/** Parses a `dd.MM.yyyy` string into an ISO date string (`yyyy-MM-dd`), or undefined if invalid. */
function parseDisplayDate(text: string): string | undefined {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parsed = parse(trimmed, DISPLAY_FORMAT, new Date());
  return isValid(parsed) ? format(parsed, "yyyy-MM-dd") : undefined;
}

/**
 * Date field matching the SAC "C004 Date Input" component (`.c-date-input`):
 * a nested, floating bold label inside the input box, with a red calendar
 * icon button on the right (see technische-anforderungen.md § 4.5).
 *
 * The visible field is a plain text input showing `dd.MM.yyyy`, so its whole
 * content can be selected and deleted like any other text field. The red
 * calendar icon opens the browser's native date picker (backed by a hidden
 * `<input type="date">`), which writes back into the visible text field.
 */
export function DateInputField({ id, label, value, onChange, className }: DateInputFieldProps) {
  const [text, setText] = useState(() => formatDate(value));
  const nativeInputRef = useRef<HTMLInputElement>(null);

  // Keep the visible text in sync when the value changes from outside
  // (e.g. filter reset), but not while the user is actively typing.
  useEffect(() => {
    setText(formatDate(value));
  }, [value]);

  const commit = (raw: string) => {
    if (!raw.trim()) {
      onChange("");
      return;
    }
    const iso = parseDisplayDate(raw);
    if (iso) {
      onChange(iso);
    } else {
      // Invalid input: revert to the last known-good value.
      setText(formatDate(value));
    }
  };

  const openPicker = () => {
    const input = nativeInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
    } else {
      input.click();
    }
  };

  return (
    <div className={cn("relative cursor-pointer", className)}>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-[14px] top-[7px] z-10 text-xs font-semibold text-sac-black"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        placeholder="TT.MM.JJJJ"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => commit(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit(e.currentTarget.value);
            e.currentTarget.blur();
          }
        }}
        className={cn(
          "h-[50px] w-full border border-sac-gray bg-white pl-[14px] pr-10 pt-[18px] text-xs font-light text-sac-black",
          "transition-[border-color,box-shadow] duration-[180ms] ease-[cubic-bezier(0,0,0.2,1)]",
          "focus:outline-none focus:border-sac-red focus:ring-2 focus:ring-sac-red/40",
          "disabled:cursor-default disabled:bg-sac-gray-light disabled:text-sac-gray-medium"
        )}
      />
      {/* Hidden native date input, only used to render the browser's calendar picker. */}
      <input
        ref={nativeInputRef}
        type="date"
        tabIndex={-1}
        aria-hidden
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
          setText(formatDate(e.target.value));
        }}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
      />
      <button
        type="button"
        onClick={openPicker}
        aria-label={`${label}: Kalender öffnen`}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded text-sac-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sac-red/40"
      >
        <Calendar className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
