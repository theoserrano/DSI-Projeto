import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useTheme } from "@/context/ThemeContext";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useNotifications } from '@/context/NotificationsContext';
import { NOTIFICATION_SECTION_LABELS } from '@/constants/notifications';
import { partitionNotifications } from '@/utils/notifications';
import type { Notification } from '@/types/notifications';

// initial example data replaced by NotificationsContext

import { BOTTOM_NAV_ICONS } from '@/constants/navigation';

type FriendRequestCardProps = {
	request: Notification;
};

function FriendRequestCard({ request }: FriendRequestCardProps) {
	const theme = useTheme();
	const firstLetter = request.title.charAt(0).toUpperCase();

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
			<View style={{ flex: 1 }}>
				<Text style={[styles.userName, { color: theme.colors.text }]}>{request.title}</Text>
				{request.message ? (
					<Text style={[styles.message, { color: theme.colors.muted }]} numberOfLines={2}>
						{request.message}
					</Text>
				) : null}
			</View>
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

type GeneralNotificationCardProps = {
	notification: Notification;
};

function GeneralNotificationCard({ notification }: GeneralNotificationCardProps) {
	const theme = useTheme();

	return (
		<View
			style={[
				styles.card,
				styles.generalCard,
				{
					backgroundColor: theme.colors.card,
					borderColor: theme.colors.primary,
					shadowColor: theme.colors.primary + "15",
				},
			]}
		>
			<View
				style={[
					styles.generalIconContainer,
					{ backgroundColor: theme.colors.primary + "12" },
				]}
			>
				<Ionicons name="notifications-outline" size={20} color={theme.colors.primary} />
			</View>
			<View style={styles.generalContent}>
				<Text style={[styles.generalTitle, { color: theme.colors.text }]} numberOfLines={2}>
					{notification.title}
				</Text>
				{notification.message ? (
					<Text style={[styles.message, { color: theme.colors.muted }]} numberOfLines={2}>
						{notification.message}
					</Text>
				) : null}
			</View>
		</View>
	);
}

export default function NotificationsScreen() {
	const theme = useTheme();
	const router = useRouter();
	const { notifications } = useNotifications();
	const { friendRequests, general } = partitionNotifications(notifications);
	const hasFriendRequests = friendRequests.length > 0;
	const hasGeneralNotifications = general.length > 0;

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

					<ScrollView
						contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.colors.background }]}
						showsVerticalScrollIndicator={false}
					>
						<View style={styles.section}>
							<Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
								{NOTIFICATION_SECTION_LABELS.FRIEND_REQUESTS}
							</Text>
							{hasFriendRequests ? (
								friendRequests.map((request) => (
									<FriendRequestCard key={request.id} request={request} />
								))
							) : (
								<Text style={[styles.emptyMessage, { color: theme.colors.muted }]}>
									Nenhum pedido de amizade por enquanto.
								</Text>
							)}
						</View>

						<View style={styles.section}>
							<Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
								{NOTIFICATION_SECTION_LABELS.GENERAL}
							</Text>
							{hasGeneralNotifications ? (
								general.map((notification) => (
									<GeneralNotificationCard key={notification.id} notification={notification} />
								))
							) : (
								<Text style={[styles.emptyMessage, { color: theme.colors.muted }]}>
									Você está em dia! Sem novas notificações.
								</Text>
							)}
						</View>
					</ScrollView>
				</View>

				<BottomNav tabs={BOTTOM_NAV_ICONS as any} />
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
	scrollContent: {
		paddingBottom: 160,
		paddingTop: 12,
	},
	section: {
		marginBottom: 28,
	},
	sectionTitle: {
		fontSize: 20,
		fontFamily: "SansationBold",
		marginHorizontal: 20,
		marginBottom: 12,
	},
	emptyMessage: {
		marginHorizontal: 20,
		fontSize: 14,
		fontFamily: "SansationBold",
		opacity: 0.8,
	},
	card: {
		flexDirection: "row",
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
		fontSize: 16,
		fontFamily: "SansationBold",
	},
	message: {
		marginTop: 6,
		fontSize: 13,
		fontFamily: "SansationBold",
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		marginLeft: 12,
	},
	actionButton: {
		marginLeft: 12,
	},
	generalCard: {
		alignItems: "flex-start",
	},
	generalIconContainer: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		marginRight: 16,
	},
	generalContent: {
		flex: 1,
	},
	generalTitle: {
		fontSize: 16,
		fontFamily: "SansationBold",
	},
});
