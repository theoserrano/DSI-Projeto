import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Text, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CardReview } from "@/components/ui/CardReview";
import { useTheme } from "@/context/ThemeContext";
import { useReviews } from "@/context/ReviewsContext";
import { useRouter } from "expo-router";
import type { ReviewWithUser } from "@/types/reviews";

export default function ReviewsScreen() {
	const theme = useTheme();
	const router = useRouter();
	const { reviews, loading, error, refreshReviews } = useReviews();
	const [refreshing, setRefreshing] = useState(false);

	// Carrega reviews ao montar o componente
	useEffect(() => {
		refreshReviews();
	}, []);

	// Handle pull-to-refresh
	const handleRefresh = async () => {
		setRefreshing(true);
		await refreshReviews();
		setRefreshing(false);
	};

	// Loading state
	if (loading && !refreshing && reviews.length === 0) {
		return (
			<View style={[styles.container, { backgroundColor: theme?.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
				<ActivityIndicator size="large" color={theme?.colors.primary} />
				<Text style={[styles.loadingText, { color: theme?.colors.text }]}>
					Carregando reviews...
				</Text>
			</View>
		);
	}

	// Empty state
	if (!loading && reviews.length === 0) {
		return (
			<View style={[styles.container, { backgroundColor: theme?.colors.background }]}>
				<View style={styles.emptyContainer}>
					<Ionicons name="chatbubble-ellipses-outline" size={80} color={theme?.colors.muted} />
					<Text style={[styles.emptyTitle, { color: theme?.colors.text }]}>
						Nenhuma review ainda
					</Text>
					<Text style={[styles.emptySubtitle, { color: theme?.colors.muted }]}>
						Seja o primeiro a avaliar uma música!
					</Text>
					<TouchableOpacity 
						style={[styles.exploreButton, { backgroundColor: theme?.colors.primary }]}
						onPress={() => router.push('/search')}
					>
						<Text style={styles.exploreButtonText}>Explorar Músicas</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: theme?.colors.background }]}> 
			<FlatList
				data={reviews}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <CardReview review={item} />}
				contentContainerStyle={{ paddingVertical: 16 }}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl 
						refreshing={refreshing} 
						onRefresh={handleRefresh}
						tintColor={theme?.colors.primary}
						colors={[theme?.colors.primary || '#3498db']}
					/>
				}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		fontFamily: 'Sansation',
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 32,
	},
	emptyTitle: {
		fontSize: 24,
		fontFamily: 'SansationBold',
		marginTop: 24,
		marginBottom: 8,
		textAlign: 'center',
	},
	emptySubtitle: {
		fontSize: 16,
		fontFamily: 'Sansation',
		textAlign: 'center',
		marginBottom: 32,
	},
	exploreButton: {
		paddingHorizontal: 32,
		paddingVertical: 14,
		borderRadius: 25,
	},
	exploreButtonText: {
		color: '#fff',
		fontSize: 16,
		fontFamily: 'SansationBold',
	},
});
