export type EventType =
  | "show"
  | "festival"
  | "party"
  | "meetup"
  | "workshop"
  | "listening"
  | "jam_session"
  | "other";

export type EventGenre =
  | "general"
  | "rock"
  | "pop"
  | "electronic"
  | "hip_hop"
  | "jazz"
  | "classical"
  | "indie"
  | "mpb"
  | "samba"
  | "sertanejo"
  | "gospel";

export type ShowEvent = {
    id: string;
  title: string;
  description?: string | null;
  eventType: EventType;
  genres: EventGenre[];
  locationName: string;
  address?: string | null;
  city: string;
  state?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  startsAt: string;
  endsAt?: string | null;
  ticketsUrl?: string | null;
  promoterId: string;
  promoterName: string;
  promoterAvatarUrl?: string | null;
  promoterContact?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string | null;
};

type ShowEventPayloadBase = {
  title: string;
  description?: string | null;
  eventType: EventType;
  genres: EventGenre[];
  locationName: string;
  address?: string | null;
  city: string;
  state?: string | null;
  country?: string | null;
  latitude: number;
  longitude: number;
  startsAt: string;
  endsAt?: string | null;
  ticketsUrl?: string | null;
  promoterAvatarUrl?: string | null;
  promoterContact?: string | null;
  isPublic: boolean;
};

export type ShowEventCreateInput = ShowEventPayloadBase & {
  promoterId: string;
  promoterName: string;
};

export type ShowEventUpdateInput = Partial<ShowEventPayloadBase> & {
  id: string;
  promoterName?: string | null;
};
