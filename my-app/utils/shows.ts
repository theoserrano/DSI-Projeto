import { EventGenre, EventType, ShowEvent } from "@/types/shows";

const REQUIRED_STRING_FIELDS: Array<keyof ShowEvent> = [
  "id",
  "title",
  "locationName",
  "city",
  "promoterId",
  "promoterName",
  "startsAt",
];

export function normalizeShowEvent(value: unknown): ShowEvent | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  const normalizedStrings: Partial<Record<keyof ShowEvent, string>> = {};

  for (const key of REQUIRED_STRING_FIELDS) {
    const text = toCleanString(record[key as string]);
    if (!text) {
      return null;
    }
    normalizedStrings[key] = text;
  }

  const eventType = toEventType(record.eventType);
  if (!eventType) {
    return null;
  }

  const genres = toGenres(record.genres);
  if (!genres.length) {
    return null;
  }

  const latitude = toCoordinate(record.latitude);
  const longitude = toCoordinate(record.longitude);
  if (latitude === null || longitude === null) {
    return null;
  }

  return {
    id: normalizedStrings.id!,
    title: normalizedStrings.title!,
    description: optionalString(record.description),
    eventType,
    genres,
    locationName: normalizedStrings.locationName!,
    address: optionalString(record.address),
    city: normalizedStrings.city!,
    state: optionalString(record.state),
    country: optionalString(record.country),
    latitude,
    longitude,
    startsAt: toDateIso(normalizedStrings.startsAt!) ?? new Date().toISOString(),
    endsAt: optionalDate(record.endsAt),
    ticketsUrl: optionalString(record.ticketsUrl),
    promoterId: normalizedStrings.promoterId!,
    promoterName: normalizedStrings.promoterName!,
    promoterAvatarUrl: optionalString(record.promoterAvatarUrl),
    promoterContact: optionalString(record.promoterContact),
    isPublic: toBoolean(record.isPublic, true),
    createdAt: toDateIso(optionalString(record.createdAt)) ?? new Date().toISOString(),
    updatedAt: optionalDate(record.updatedAt),
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

export function toCoordinate(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length) {
    const numeric = Number(value.replace(",", "."));
    return Number.isFinite(numeric) ? numeric : null;
  }
  return null;
}

export function formatEventDateRange(startsAt: string, endsAt?: string | null): string {
  try {
    const start = new Date(startsAt);
    if (Number.isNaN(start.getTime())) {
      return startsAt;
    }

    const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const startDate = dateFormatter.format(start);
    const startTime = timeFormatter.format(start);

    if (!endsAt) {
      return `${startDate} · ${startTime}`;
    }

    const end = new Date(endsAt);
    if (Number.isNaN(end.getTime())) {
      return `${startDate} · ${startTime}`;
    }

    const sameDay = start.toDateString() === end.toDateString();
    const endDate = dateFormatter.format(end);
    const endTime = timeFormatter.format(end);

    if (sameDay) {
      return `${startDate} · ${startTime} – ${endTime}`;
    }

    return `${startDate} · ${startTime} → ${endDate} · ${endTime}`;
  } catch {
    return startsAt;
  }
}

function optionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const text = value.trim();
  return text.length ? text : null;
}

function toCleanString(value: unknown): string | null {
  if (typeof value === "string" || typeof value === "number") {
    const text = String(value).trim();
    return text.length ? text : null;
  }
  return null;
}

function toEventType(value: unknown): EventType | null {
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.trim().toLowerCase() as EventType;
  const allowed: EventType[] = [
    "show",
    "festival",
    "party",
    "meetup",
    "workshop",
    "listening",
    "jam_session",
    "other",
  ];
  return allowed.includes(normalized) ? normalized : null;
}

function toGenres(value: unknown): EventGenre[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim().toLowerCase() : ""))
      .filter((item): item is EventGenre => isValidGenre(item));
  }

  if (typeof value === "string" && value.trim().length) {
    return value
      .split(/[,;|]/)
      .map((item) => item.trim().toLowerCase())
      .filter((item): item is EventGenre => isValidGenre(item));
  }

  return [];
}

function isValidGenre(value: string): value is EventGenre {
  return [
    "general",
    "rock",
    "pop",
    "electronic",
    "hip_hop",
    "jazz",
    "classical",
    "indie",
    "mpb",
    "samba",
    "sertanejo",
    "gospel",
  ].includes(value as EventGenre);
}

function toDateIso(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Date(timestamp).toISOString();
}

function optionalDate(value: unknown): string | null {
  if (typeof value === "string") {
    return toDateIso(value);
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  return null;
}

function toBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes"].includes(normalized)) {
      return true;
    }
    if (["false", "0", "no"].includes(normalized)) {
      return false;
    }
  }
  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }
    if (value === 0) {
      return false;
    }
  }
  return fallback;
}
