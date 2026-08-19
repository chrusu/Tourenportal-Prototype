import type { Tour } from "@/types/tour";
import { formatDate } from "./format";
import { registrationStatus, regStatusLabel } from "./status";

/** Escapes a single CSV field (quoting when it contains `;`, `"`, or a newline). */
function escapeCsvField(value: string): string {
  if (/[";\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

const CSV_COLUMNS: { header: string; value: (tour: Tour) => string }[] = [
  { header: "Datum", value: (t) => formatDate(t.startDate) },
  { header: "Enddatum", value: (t) => (t.endDate ? formatDate(t.endDate) : "") },
  { header: "Titel", value: (t) => t.title },
  { header: "Aktivität", value: (t) => t.tourType.join(", ") },
  { header: "Schwierigkeit", value: (t) => t.technicalDifficulty ?? "" },
  { header: "Kondition", value: (t) => t.physicalDifficulty ?? "" },
  { header: "Gruppe", value: (t) => t.groups.join(", ") },
  { header: "Tourenleiter", value: (t) => t.leaders.map((l) => l.name).join(", ") },
  { header: "Plätze", value: (t) => t.participants?.display ?? "" },
  { header: "Status", value: (t) => regStatusLabel(registrationStatus(t)) },
];

/** Serializes a list of tours to a semicolon-separated CSV string (Excel-friendly). */
export function toursToCsv(tours: Tour[]): string {
  const header = CSV_COLUMNS.map((c) => escapeCsvField(c.header)).join(";");
  const rows = tours.map((tour) =>
    CSV_COLUMNS.map((c) => escapeCsvField(c.value(tour))).join(";")
  );
  return [header, ...rows].join("\r\n");
}

/** Triggers a browser download of the given text content as a file. */
export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  // Prepend a UTF-8 BOM so Excel doesn't mangle special characters (ä, ö, ü, …).
  const blob = new Blob(["\ufeff" + content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
