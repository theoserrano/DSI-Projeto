import { ShowEvent } from "@/types/shows";

const REQUIRED_STRING_FIELDS: Array<keyof ShowEvent> = [
  "id",
  "title",
  "artist",
  "venue",
  "city",
  "date",
];

export function normalizeShowEvent(value: unknown): ShowEvent | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  const strings: Record<string, string> = {};

  for (const key of REQUIRED_STRING_FIELDS) {
    const raw = record[key as string];
    if (typeof raw !== "string" && typeof raw !== "number") {
      return null;
    }
    const text = String(raw).trim();
    if (!text) {
      return null;
    }
    strings[key] = text;
  }

  const latitude = extractCoordinate(record.latitude);
  const longitude = extractCoordinate(record.longitude);

  if (latitude === null || longitude === null) {
    return null;
  }

  return {
    id: strings.id,
    title: strings.title,
    artist: strings.artist,
    venue: strings.venue,
    city: strings.city,
    date: strings.date,
    latitude,
    longitude,
  };
}

export function parseShowsPayload(payload: unknown): ShowEvent[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => normalizeShowEvent(item))
    .filter((item): item is ShowEvent => item !== null);
}

function extractCoordinate(value: unknown): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const numeric = Number(value.replace(",", "."));
    return Number.isFinite(numeric) ? numeric : null;
  }

  return null;
}
