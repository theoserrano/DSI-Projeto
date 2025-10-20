// Types para Tracks/Músicas

export interface Track {
  track_id: string;
  track_name: string;
  track_artist: string;
  track_album_name: string;
  track_album_release_date?: string;
  track_popularity?: number;
  playlist_name?: string;
  playlist_id?: string;
  playlist_genre?: string;
  playlist_subgenre?: string;
  danceability?: number;
  energy?: number;
  key?: number;
  loudness?: number;
  mode?: number;
  speechiness?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  valence?: number;
  tempo?: number;
  duration_ms?: number;
}

export interface TrackWithStats extends Track {
  average_rating?: number;
  total_reviews?: number;
  cover?: string; // URL da capa do álbum
}
