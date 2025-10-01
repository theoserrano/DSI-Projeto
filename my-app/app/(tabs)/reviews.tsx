import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { CardReview } from "@/components/ui/CardReview";
import { useTheme } from "@/context/ThemeContext";

const reviewsMock = [
	{
		userName: "Ana Souza",
		userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
		rating: 5,
		songTitle: "Shape of You",
		artist: "Ed Sheeran",
		album: "Divide",
		cover: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png",
		comment: "Amo essa música! Sempre me anima.",
	},
	{
		userName: "Carlos Lima",
		userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
		rating: 4,
		songTitle: "Blinding Lights",
		artist: "The Weeknd",
		album: "After Hours",
		cover: "https://upload.wikimedia.org/wikipedia/en/a/a0/The_Weeknd_-_After_Hours.png",
		comment: "Muito boa para ouvir dirigindo.",
	},
	{
		userName: "Julia Mendes",
		userAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
		rating: 3,
		songTitle: "Levitating",
		artist: "Dua Lipa",
		album: "Future Nostalgia",
		cover: "https://upload.wikimedia.org/wikipedia/en/0/0a/Dua_Lipa_-_Future_Nostalgia_%28Official_Album_Cover%29.png",
		comment: "Legal, mas enjoa rápido.",
	},
];

export default function ReviewsScreen() {
	const theme = useTheme();
	return (
		<View style={[styles.container, { backgroundColor: theme?.colors.background }]}> 
			<FlatList
				data={reviewsMock}
				keyExtractor={(_, idx) => String(idx)}
				renderItem={({ item }) => <CardReview {...item} />}
				contentContainerStyle={{ paddingVertical: 16 }}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
