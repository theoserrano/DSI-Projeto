// Types para o sistema de Reviews

export interface Review {
  id: string;
  user_id: string;
  track_id: string;
  rating: number; // 1-5
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface ReviewWithUser extends Review {
  user_name?: string;
  user_username?: string;
  user_avatar?: string;
}

export interface CreateReviewInput {
  track_id: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  comment?: string;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  rating_distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
