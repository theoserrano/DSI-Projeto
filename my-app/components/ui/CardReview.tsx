import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { getTrackById } from "@/services/tracks";
import type { ReviewWithUser } from "@/types/reviews";
import type { TrackWithStats } from "@/types/tracks";

type CardReviewProps = {
  review: ReviewWithUser;
  onReportPress?: () => void;
  onEditPress?: (review: ReviewWithUser, track?: TrackWithStats) => void;
  onDeletePress?: (review: ReviewWithUser, track?: TrackWithStats) => void;
  hideReportButton?: boolean;
};

export function CardReview({
  review,
  onReportPress,
  onEditPress,
  onDeletePress,
  hideReportButton,
}: CardReviewProps) {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useAuth();
  const showReportAction = Boolean(onReportPress) && !hideReportButton;
  
  const [track, setTrack] = useState<TrackWithStats | null>(null);
  const [loadingTrack, setLoadingTrack] = useState(true);
  
  // Verifica se o usuário logado é o autor da review
  const isAuthor = user && (user.id === review.user_id || user.uid === review.user_id);
  const showEditOptions = Boolean(isAuthor && (onEditPress || onDeletePress));

  // Carrega informações da música
  useEffect(() => {
    async function loadTrack() {
      setLoadingTrack(true);
      try {
        const trackData = await getTrackById(review.track_id);
        setTrack(trackData);
      } catch (error) {
        console.error('[CardReview] Erro ao carregar música:', error);
      } finally {
        setLoadingTrack(false);
      }
    }
    
    loadTrack();
  }, [review.track_id]);

  // Navegação para a página da música
  const handlePressTrack = () => {
    if (track) {
      router.push(`/song/${track.track_id}`);
    }
  };

  // Valores padrão
  const userName = review.user_name || review.user_username || 'Usuário';
  const userAvatar = review.user_avatar || "https://via.placeholder.com/100/3498db/ffffff?text=U";
  const comment = review.comment || 'Sem comentário';

  return (
    <View
      style={[
        styles.card,
        { 
          backgroundColor: theme?.colors.card,
          borderRadius: theme?.components.card.borderRadius,
          padding: theme?.components.card.padding,
          shadowOpacity: theme?.components.card.shadowOpacity,
          shadowRadius: theme?.components.card.shadowRadius,
          shadowOffset: theme?.components.card.shadowOffset,
          elevation: theme?.components.card.elevation,
        },
      ]}
    >
      {/* Header do usuário */}
      <View style={styles.header}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={[
            styles.userName, 
            { 
              color: theme?.colors.text,
              fontSize: theme?.typography.fontSize.base,
              fontFamily: 'SansationBold',
            }
          ]}>
            {userName}
          </Text>
          <View style={styles.stars}>
            {Array.from({ length: 5 }).map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={14}
                color={i < review.rating ? theme?.colors.star : theme?.colors.muted}
              />
            ))}
          </View>
        </View>
        
        {/* Botões de ação para o autor */}
        {showEditOptions && (
          <View style={styles.authorActions}>
            {onEditPress && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onEditPress(review, track || undefined)}
                activeOpacity={0.6}
              >
                <Ionicons name="pencil" size={18} color={theme?.colors.primary} />
              </TouchableOpacity>
            )}
            {onDeletePress && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => onDeletePress(review, track || undefined)}
                activeOpacity={0.6}
              >
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Música */}
      {loadingTrack ? (
        <View style={[styles.songInfo, { justifyContent: 'center', alignItems: 'center', minHeight: 60 }]}>
          <ActivityIndicator size="small" color={theme?.colors.primary} />
        </View>
      ) : track ? (
        <TouchableOpacity style={styles.songInfo} onPress={handlePressTrack} activeOpacity={0.7}>
          <Image source={{ uri: track.cover }} style={styles.cover} />
          <View style={styles.textInfo}>
            <Text style={[
              styles.songTitle, 
              { 
                color: theme?.colors.text,
                fontSize: theme?.typography.fontSize.xl,
                fontFamily: 'SansationBold',
              }
            ]}>
              {track.track_name}
            </Text>
            <Text style={[
              styles.artist, 
              { 
                color: theme?.colors.secondary,
                fontSize: theme?.typography.fontSize.base,
                fontFamily: 'Sansation',
              }
            ]}>
              {track.track_artist}
            </Text>
            <Text style={[
              styles.album, 
              { 
                color: theme?.colors.muted,
                fontSize: theme?.typography.fontSize.sm,
                fontFamily: 'Sansation',
              }
            ]}>
              {track.track_album_name}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme?.colors.muted} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      ) : (
        <View style={styles.songInfo}>
          <View style={[styles.cover, { backgroundColor: theme?.colors.muted, justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="musical-note" size={24} color={theme?.colors.background} />
          </View>
          <View style={styles.textInfo}>
            <Text style={[
              styles.songTitle, 
              { 
                color: theme?.colors.muted,
                fontSize: theme?.typography.fontSize.xl,
                fontFamily: 'SansationBold',
              }
            ]}>
              Música não encontrada
            </Text>
          </View>
        </View>
      )}

      {/* Comentário */}
      <Text style={[
        styles.comment, 
        { 
          color: theme?.colors.text,
          fontSize: theme?.typography.fontSize.md,
          fontFamily: 'Sansation',
        }
      ]}>
        <Text style={{ color: theme?.colors.primary }}>"</Text>
        {comment}
        <Text style={{ color: theme?.colors.primary }}>"</Text>
      </Text>

      {showReportAction && (
        <TouchableOpacity
          style={styles.reportButton}
          onPress={onReportPress}
          activeOpacity={0.6}
        >
          <Ionicons name="alert-circle-outline" size={16} color={theme?.colors.muted} />
          <Text style={[
            styles.reportLabel, 
            { 
              color: theme?.colors.muted,
              fontSize: theme?.typography.fontSize.sm,
              fontFamily: 'Sansation',
            }
          ]}>Denunciar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  authorActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    padding: 6,
    borderRadius: 6,
  },
  userName: {
  },
  stars: {
    flexDirection: "row",
    marginTop: 2,
  },
  songInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  cover: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  songTitle: {
  },
  artist: {
  },
  album: {
  },
  comment: {
    fontStyle: "italic",
    marginTop: 4,
    lineHeight: 20,
  },
  reportButton: {
    marginTop: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
    gap: 4,
  },
  reportLabel: {
  },
});
