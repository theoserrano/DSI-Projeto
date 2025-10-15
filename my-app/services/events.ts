import { supabase } from "@/services/supabaseConfig";
import {
  EventGenre,
  EventType,
  ShowEvent,
  ShowEventCreateInput,
  ShowEventUpdateInput,
} from "@/types/shows";
import { generateSemanticEventId } from "@/utils/eventIdGenerator";

const EVENTS_TABLE = "events";

export type EventsFilter = {
  search?: string;
  types?: EventType[];
  genres?: EventGenre[];
  includePrivate?: boolean;
  promoterId?: string;
  startAfter?: string;
  startBefore?: string;
};

export async function fetchEvents(filter: EventsFilter = {}): Promise<ShowEvent[]> {
  let query = supabase.from(EVENTS_TABLE).select(selectColumns).order("starts_at", { ascending: true });

  if (!filter.includePrivate) {
    query = query.eq("is_public", true);
  }

  if (filter.types && filter.types.length) {
    query = query.in("event_type", filter.types);
  }

  if (filter.genres && filter.genres.length) {
    query = query.contains("genres", filter.genres);
  }

  if (filter.promoterId) {
    query = query.eq("promoter_id", filter.promoterId);
  }

  if (filter.startAfter) {
    query = query.gte("starts_at", filter.startAfter);
  }

  if (filter.startBefore) {
    query = query.lte("starts_at", filter.startBefore);
  }

  if (filter.search && filter.search.trim().length) {
    const term = `%${filter.search.trim()}%`;
    query = query.or(
      `title.ilike.${term},description.ilike.${term},location_name.ilike.${term},city.ilike.${term}`
    );
  }

  const { data, error } = await query.returns<EventRecord[]>();

  if (error) {
    if (__DEV__) {
      console.error("[Events] fetchEvents ERROR:", error);
    }
    throw error;
  }

  if (__DEV__) {
    console.log("[Events] fetchEvents SUCCESS:", data?.length || 0, "eventos");
  }

  return (data ?? []).map(adaptRecordToShowEvent);
}

export async function createEvent(payload: ShowEventCreateInput): Promise<ShowEvent> {
  const prepared = mapCreatePayload(payload);
  const eventId = generateSemanticEventId(payload.title);
  
  if (__DEV__) {
    console.log("[Events] createEvent payload:", { ...prepared, id: eventId });
  }
  
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .insert({ ...prepared, id: eventId })
    .select(selectColumns)
    .returns<EventRecord>()
    .single();

  if (error) {
    if (__DEV__) {
      console.error("[Events] createEvent ERROR:", error);
    }
    throw error;
  }

  if (__DEV__) {
    console.log("[Events] createEvent SUCCESS:", data);
  }

  return adaptRecordToShowEvent(data);
}

export async function updateEvent(payload: ShowEventUpdateInput): Promise<ShowEvent> {
  const prepared = mapUpdatePayload(payload);
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .update(prepared)
    .eq("id", payload.id)
    .select(selectColumns)
    .returns<EventRecord>()
    .single();

  if (error) {
    throw error;
  }

  return adaptRecordToShowEvent(data);
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from(EVENTS_TABLE).delete().eq("id", id);
  if (error) {
    throw error;
  }
}

export async function fetchEventById(id: string): Promise<ShowEvent | null> {
  const { data, error } = await supabase
    .from(EVENTS_TABLE)
    .select(selectColumns)
    .eq("id", id)
    .returns<EventRecord>()
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? adaptRecordToShowEvent(data) : null;
}

type EventRecord = {
  id: string;
  title: string;
  description?: string | null;
  event_type: EventType;
  genres: EventGenre[] | null;
  location_name: string;
  address?: string | null;
  city: string;
  state?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  starts_at: string;
  ends_at?: string | null;
  tickets_url?: string | null;
  promoter_id: string;
  promoter_name?: string | null;
  promoter_contact?: string | null;
  promoter_avatar_url?: string | null;
  is_public: boolean;
  created_at: string;
  updated_at?: string | null;
  profiles?:
    | {
        id: string;
        name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
      }
    | Array<{
        id: string;
        name?: string | null;
        username?: string | null;
        avatar_url?: string | null;
      }>
    | null;
};

const selectColumns =
  `id, title, description, event_type, genres, location_name, address, city, state, country, latitude, longitude, starts_at, ends_at, tickets_url, promoter_id, promoter_name, promoter_contact, promoter_avatar_url, is_public, created_at, updated_at`;

function mapCreatePayload(payload: ShowEventCreateInput) {
  return {
    title: payload.title,
    description: payload.description ?? null,
    event_type: payload.eventType,
    genres: payload.genres,
    location_name: payload.locationName,
    address: payload.address ?? null,
    city: payload.city,
    state: payload.state ?? null,
    country: payload.country ?? null,
    latitude: payload.latitude,
    longitude: payload.longitude,
    starts_at: payload.startsAt,
    ends_at: payload.endsAt ?? null,
    tickets_url: payload.ticketsUrl ?? null,
    promoter_id: payload.promoterId,
    promoter_name: payload.promoterName,
    promoter_contact: payload.promoterContact ?? null,
    promoter_avatar_url: payload.promoterAvatarUrl ?? null,
    is_public: payload.isPublic,
  } satisfies Omit<EventRecord, "id" | "created_at" | "updated_at" | "profiles">;
}

function mapUpdatePayload(payload: ShowEventUpdateInput) {
  const base = {
    title: payload.title,
    description: payload.description ?? undefined,
    event_type: payload.eventType,
    genres: payload.genres,
    location_name: payload.locationName,
    address: payload.address ?? undefined,
    city: payload.city,
    state: payload.state ?? undefined,
    country: payload.country ?? undefined,
    latitude: payload.latitude,
    longitude: payload.longitude,
    starts_at: payload.startsAt,
    ends_at: payload.endsAt ?? undefined,
    tickets_url: payload.ticketsUrl ?? undefined,
    promoter_name: payload.promoterName ?? undefined,
    promoter_contact: payload.promoterContact ?? undefined,
    promoter_avatar_url: payload.promoterAvatarUrl ?? undefined,
    is_public: payload.isPublic,
  } satisfies Partial<Omit<EventRecord, "id" | "created_at" | "updated_at" | "profiles" | "promoter_id">>;

  return Object.entries(base).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function adaptRecordToShowEvent(record: EventRecord): ShowEvent {
  const promoterName = record.promoter_name?.trim() || "Organizador";

  return {
    id: record.id,
    title: record.title,
    description: record.description ?? null,
    eventType: record.event_type,
    genres: (record.genres && record.genres.length ? record.genres : ["general"]) as EventGenre[],
    locationName: record.location_name,
    address: record.address ?? null,
    city: record.city,
    state: record.state ?? null,
    country: record.country ?? null,
    latitude: Number(record.latitude),
    longitude: Number(record.longitude),
    startsAt: record.starts_at,
    endsAt: record.ends_at ?? null,
    ticketsUrl: record.tickets_url ?? null,
    promoterId: record.promoter_id,
    promoterName,
    promoterAvatarUrl: record.promoter_avatar_url ?? null,
    promoterContact: record.promoter_contact ?? null,
    isPublic: record.is_public,
    createdAt: record.created_at,
    updatedAt: record.updated_at ?? null,
  };
}
