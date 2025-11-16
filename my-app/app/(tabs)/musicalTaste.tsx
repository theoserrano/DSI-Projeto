import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { BottomNav } from "@/components/navigation/BottomNav";
import { BOTTOM_NAV_ICONS } from "@/constants/navigation";
import {
  convertUserInputToFeatures,
  getQualitativeOptions,
  getFeatureDescription,
  getTopFeatures,
  type FeatureName,
} from "@/utils/featureMapping";
import {
  classifyMusicProfile,
  validateFeatures,
  type ClassificationResult,
  type GenreScore,
} from "@/services/musicClassifier";
import { supabase } from "@/services/supabaseConfig";
import { DEFAULT_ALBUM_IMAGE_URL } from "@/constants/images";

const SCREEN_WIDTH = Dimensions.get("window").width;

// Ícones para as features
const FEATURE_ICONS: Record<string, string> = {
  danceability: "musical-notes",
  energy: "flash",
  valence: "happy",
  tempo: "speedometer",
  acousticness: "guitar",
  instrumentalness: "piano",
  speechiness: "mic",
  loudness: "volume-high",
};

interface RecommendedTrack {
  track_id: string;
  track_name: string;
  track_artist: string;
  track_album_name: string;
  cover_url: string | null;
  playlist_genre: string;
  track_popularity: number;
}

export default function MusicalTasteScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [userInput, setUserInput] = useState<Record<string, string>>({});
  const [classification, setClassification] = useState<ClassificationResult | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const topFeatures = getTopFeatures();

  const handleFeatureChange = (feature: string, value: string) => {
    setUserInput(prev => ({ ...prev, [feature]: value }));
  };

  const handleClassify = async () => {
    try {
      const numericFeatures = convertUserInputToFeatures(userInput);
      const validation = validateFeatures(numericFeatures);

      if (!validation.isValid) {
        Alert.alert(
          "Informações Incompletas",
          `Por favor, preencha: ${validation.missingFeatures.join(", ")}`
        );
        return;
      }

      setLoading(true);
      const result = classifyMusicProfile(numericFeatures);
      setClassification(result);
      setShowResults(true);

      // Buscar recomendações
      await fetchRecommendations(result.primaryGenre);
    } catch (error) {
      console.error("Erro ao classificar:", error);
      Alert.alert("Erro", "Não foi possível classificar seu perfil musical");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (genre: string) => {
    try {
      const { data, error } = await supabase
        .from("tracks")
        .select("track_id, track_name, track_artist, track_album_name, cover_url, playlist_genre, track_popularity")
        .eq("playlist_genre", genre)
        .order("track_popularity", { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error("Erro ao buscar recomendações:", error);
      setRecommendations([]);
    }
  };

  const renderFeatureInput = (feature: string) => {
    const options = getQualitativeOptions(feature as FeatureName);
    const description = getFeatureDescription(feature as FeatureName);
    const selectedValue = userInput[feature];
    const icon = FEATURE_ICONS[feature] || "musical-note";

    return (
      <View key={feature} style={[styles.featureCard, { backgroundColor: colors.card }]}>
        <View style={styles.featureHeader}>
          <Ionicons name={icon as any} size={24} color={colors.primary} />
          <View style={styles.featureTitleContainer}>
            <Text style={[styles.featureTitle, { color: colors.text }]}>
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
            </Text>
            <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
              {description}
            </Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                {
                  backgroundColor: selectedValue === option ? colors.primary : colors.background,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => handleFeatureChange(feature, option)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: selectedValue === option ? "#fff" : colors.text,
                  },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderGenreScore = (score: GenreScore) => {
    const barWidth = (score.score / 100) * (SCREEN_WIDTH - 80);

    return (
      <View key={score.genre} style={styles.genreScoreContainer}>
        <View style={styles.genreHeader}>
          <Text style={styles.genreIcon}>{score.icon}</Text>
          <Text style={[styles.genreName, { color: colors.text }]}>
            {score.genreName}
          </Text>
          <Text style={[styles.genreScore, { color: colors.primary }]}>
            {score.score.toFixed(1)}%
          </Text>
        </View>
        <View style={[styles.genreBar, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.genreBarFill,
              {
                width: barWidth,
                backgroundColor: score.color,
              },
            ]}
          />
        </View>
      </View>
    );
  };

  const renderRecommendation = (track: RecommendedTrack) => {
    return (
      <TouchableOpacity
        key={track.track_id}
        style={[styles.trackCard, { backgroundColor: colors.card }]}
        onPress={() => router.push(`/song/${track.track_id}`)}
      >
        <Image
          source={{ uri: track.cover_url || DEFAULT_ALBUM_IMAGE_URL }}
          style={styles.trackImage}
        />
        <View style={styles.trackInfo}>
          <Text
            style={[styles.trackName, { color: colors.text }]}
            numberOfLines={1}
          >
            {track.track_name}
          </Text>
          <Text
            style={[styles.trackArtist, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {track.track_artist}
          </Text>
        </View>
        <Ionicons name="play-circle" size={32} color={colors.primary} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            🎵 Meu Gosto Musical
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Descubra qual gênero musical combina mais com você
          </Text>
        </View>

        {/* Explicação */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Ionicons name="information-circle" size={24} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Responda as perguntas abaixo sobre suas preferências musicais.
            Vamos usar machine learning para identificar o gênero que mais
            combina com você!
          </Text>
        </View>

        {/* Feature Inputs */}
        {!showResults && (
          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Suas Preferências
            </Text>
            {topFeatures.map(renderFeatureInput)}

            {/* Botão de Classificar */}
            <TouchableOpacity
              style={[
                styles.classifyButton,
                {
                  backgroundColor: colors.primary,
                  opacity: Object.keys(userInput).length < 8 ? 0.5 : 1,
                },
              ]}
              onPress={handleClassify}
              disabled={Object.keys(userInput).length < 8 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="sparkles" size={24} color="#fff" />
                  <Text style={styles.classifyButtonText}>
                    Descobrir Meu Gênero
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Results */}
        {showResults && classification && (
          <>
            {/* Primary Genre */}
            <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.resultTitle, { color: colors.text }]}>
                Seu Gênero Principal
              </Text>
              <View style={styles.primaryGenreContainer}>
                <Text style={styles.primaryGenreIcon}>
                  {classification.allScores[0].icon}
                </Text>
                <Text style={[styles.primaryGenre, { color: colors.primary }]}>
                  {classification.allScores[0].genreName}
                </Text>
                <Text style={[styles.confidence, { color: colors.textSecondary }]}>
                  {classification.confidence.toFixed(1)}% de afinidade
                </Text>
              </View>
            </View>

            {/* All Genres */}
            <View style={[styles.scoresCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Afinidade com Gêneros
              </Text>
              {classification.allScores.map(renderGenreScore)}
            </View>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <View style={styles.recommendationsSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Músicas Recomendadas
                </Text>
                {recommendations.map(renderRecommendation)}
              </View>
            )}

            {/* Reset Button */}
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: colors.primary }]}
              onPress={() => {
                setShowResults(false);
                setClassification(null);
                setUserInput({});
                setRecommendations([]);
              }}
            >
              <Ionicons name="refresh" size={20} color={colors.primary} />
              <Text style={[styles.resetButtonText, { color: colors.primary }]}>
                Refazer Teste
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav tabs={BOTTOM_NAV_ICONS as any} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    lineHeight: 20,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  featureCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  classifyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  classifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultCard: {
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  primaryGenreContainer: {
    alignItems: "center",
  },
  primaryGenreIcon: {
    fontSize: 60,
    marginBottom: 8,
  },
  primaryGenre: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  confidence: {
    fontSize: 16,
  },
  scoresCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  genreScoreContainer: {
    marginBottom: 16,
  },
  genreHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  genreIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  genreName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  genreScore: {
    fontSize: 16,
    fontWeight: "bold",
  },
  genreBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  genreBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  recommendationsSection: {
    marginBottom: 16,
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 8,
    marginBottom: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
