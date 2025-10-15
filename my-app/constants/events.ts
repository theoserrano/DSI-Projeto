import { EventGenre, EventType } from "@/types/shows";

export const EVENT_TYPES: Array<{ value: EventType; label: string; description?: string }> = [
  { value: "show", label: "Show", description: "Apresentação principal ou turnê." },
  { value: "festival", label: "Festival", description: "Evento com múltiplas atrações." },
  { value: "party", label: "Festa", description: "Balada temática ou celebração." },
  { value: "meetup", label: "Encontro", description: "Reunião de fãs ou networking." },
  { value: "workshop", label: "Workshop", description: "Sessões de aprendizado ou masterclass." },
  { value: "listening", label: "Listening", description: "Audições guiadas ou lançamentos." },
  { value: "jam_session", label: "Jam Session", description: "Improvisos colaborativos." },
  { value: "other", label: "Outro" },
];

export const EVENT_GENRES: Array<{ value: EventGenre; label: string; color: string }> = [
  { value: "general", label: "Geral", color: "#6366F1" },
  { value: "rock", label: "Rock", color: "#EF4444" },
  { value: "pop", label: "Pop", color: "#EC4899" },
  { value: "electronic", label: "Eletrônico", color: "#22D3EE" },
  { value: "hip_hop", label: "Hip Hop", color: "#F97316" },
  { value: "jazz", label: "Jazz", color: "#A855F7" },
  { value: "classical", label: "Clássico", color: "#14B8A6" },
  { value: "indie", label: "Indie", color: "#F59E0B" },
  { value: "mpb", label: "MPB", color: "#16A34A" },
  { value: "samba", label: "Samba", color: "#10B981" },
  { value: "sertanejo", label: "Sertanejo", color: "#FACC15" },
  { value: "gospel", label: "Gospel", color: "#C084FC" },
];

export const GENRE_COLOR_MAP: Record<EventGenre, string> = EVENT_GENRES.reduce((acc, genre) => {
  acc[genre.value] = genre.color;
  return acc;
}, {} as Record<EventGenre, string>);

export const DEFAULT_EVENT_PIN_COLOR = GENRE_COLOR_MAP.general;
