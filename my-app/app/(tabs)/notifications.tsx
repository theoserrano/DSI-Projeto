import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useNotifications } from '@/context/NotificationsContext';

type FriendRequest = {
	id: string;
	name: string;
};

// initial example data replaced by NotificationsContext

const icons_navbar = [
	{ icon: "home-outline" as const, path: "/(tabs)/home" },
	{ icon: "search-outline" as const, path: "/(tabs)/search" },
	{ icon: "add-circle" as const, path: "/(tabs)/add" },
	{ icon: "person-outline" as const, path: "/(tabs)/profile" },
	{ icon: "notifications-outline" as const, path: "/(tabs)/notifications" },
];

function FriendRequestCard({ name }: FriendRequest) {
	const theme = useTheme();
	const firstLetter = name.charAt(0).toUpperCase();

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: theme.colors.card,
					borderColor: theme.colors.primary,
					shadowColor: theme.colors.primary + "20",
				},
			]}
		>
			<View
				style={[
					styles.avatar,
					{ borderColor: theme.colors.primary, backgroundColor: theme.colors.background },
				]}
			>
				<Text style={[styles.avatarText, { color: theme.colors.primary }]}>{firstLetter}</Text>
			</View>
			<Text style={[styles.userName, { color: theme.colors.text }]}>{name}</Text>
			<View style={styles.actions}>
				<TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
					<Ionicons name="checkmark-outline" size={26} color={theme.colors.primary} />
				</TouchableOpacity>
				<TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
					<Ionicons name="close-outline" size={26} color={theme.colors.primary} />
				</TouchableOpacity>
			</View>
		</View>
	);
}

export default function NotificationsScreen() {
	const theme = useTheme();
	const router = useRouter();
	const { notifications } = useNotifications();

	return (
		<SafeAreaView
			edges={["top"]}
			style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
		>
			<View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
				<View style={styles.content}>
					<View style={styles.header}>
						<TouchableOpacity onPress={() => router.back()} activeOpacity={0.8}>
							<Ionicons name="arrow-back-outline" size={28} color={theme.colors.primary} />
						</TouchableOpacity>
						<Text style={[styles.title, { color: theme.colors.primary }]}>Notificações</Text>
						<View style={{ width: 28 }} />
					</View>

					<FlatList
						data={notifications}
						keyExtractor={(item) => item.id}
						contentContainerStyle={styles.listContent}
						ListHeaderComponent={() => (
							<Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>Pedidos de Amizade</Text>
						)}
						renderItem={({ item }) => <FriendRequestCard {...item} />}
						showsVerticalScrollIndicator={false}
					/>
				</View>

				<BottomNav tabs={icons_navbar as any} />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
	},
		content: {
			flex: 1,
		},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	title: {
		flex: 1,
		textAlign: "center",
		fontSize: 22,
		fontFamily: "SansationBold",
	},
	sectionTitle: {
		fontSize: 20,
		fontFamily: "SansationBold",
		marginHorizontal: 20,
		marginBottom: 12,
	},
	listContent: {
		paddingBottom: 160,
		paddingTop: 12,
	},
	card: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: 14,
		paddingVertical: 14,
		paddingHorizontal: 16,
		marginHorizontal: 20,
		marginBottom: 16,
		shadowOpacity: 0.08,
		shadowRadius: 6,
		shadowOffset: { width: 0, height: 3 },
		elevation: 2,
	},
	avatar: {
		width: 44,
		height: 44,
		borderRadius: 22,
		borderWidth: 2,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	avatarText: {
		fontSize: 18,
		fontFamily: "SansationBold",
	},
	userName: {
		flex: 1,
		fontSize: 16,
		fontFamily: "SansationBold",
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
	},
	actionButton: {
		marginLeft: 12,
	},
});
