import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
	RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { router } from "expo-router";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/useFetch";
import BigMovieCard from "@/components/bigMovieCard";
import { getCurrentUser, getUserPreferences } from "@/services/appwrite";

const Saved = () => {
	const [favoriteMovies, setFavoriteMovies] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await loadFavorites();
		setRefreshing(false);
	};

	const loadFavorites = async () => {
		try {
			setLoading(true);
			setError(null);

			// Get user's favorite movie IDs from preferences
			const user = await getCurrentUser();
			if (!user) {
				setError("Please login to view favorites");
				return;
			}

			const prefs = await getUserPreferences();
			const favoriteIds = prefs.favorites || [];

			// Fetch details for each favorite movie
			const movies = await Promise.all(
				favoriteIds.map(async (id: string) => {
					try {
						return await fetchMovieDetails(id);
					} catch (e) {
						console.error(`Failed to fetch movie ${id}:`, e);
						return null;
					}
				})
			);

			// Filter out any failed fetches
			setFavoriteMovies(movies.filter((movie) => movie !== null));
		} catch (err) {
			console.error("Failed to load favorites:", err);
			setError("Failed to load favorite movies");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadFavorites();
	}, []);

	if (loading) {
		return (
			<View className="bg-primary flex-1 justify-center items-center">
				<ActivityIndicator size="large" color="#AB8BFF" />
			</View>
		);
	}

	if (error) {
		return (
			<View className="bg-primary flex-1 justify-center items-center px-8">
				<Text className="text-white text-lg text-center mb-4">{error}</Text>
				<TouchableOpacity
					className="bg-[#AB8BFF] px-6 py-3 rounded-md"
					onPress={loadFavorites}
				>
					<Text className="text-black text-lg font-bold">Try Again</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View className="bg-primary flex-1">
			<Image source={images.bg} className="absolute w-full z-0" />
			<Image
				source={icons.logo}
				className="w-12 h-10 mt-20 mb-10 z-2 mx-auto"
			/>

			<ScrollView
				contentContainerStyle={{ paddingBottom: 40 }}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#AB8BFF"
					/>
				}
			>
				<View className="px-6">
					<Text className="text-white text-2xl font-bold mb-6">
						Your Favorite Movies
					</Text>

					{favoriteMovies.length === 0 ? (
						<View className="flex-1 justify-center items-center mt-20">
							<Text className="text-light-200 text-lg">
								No favorite movies yet
							</Text>
							<Text className="text-light-200 mt-2 text-center">
								Tap the heart icon on movies to add them here
							</Text>
						</View>
					) : (
						<View className="flex-row flex-wrap justify-between">
							{favoriteMovies.map((movie) => (
								<BigMovieCard
									key={movie.id}
									movie={movie}
									onPress={() => router.push(`/movies/${movie.id}`)}
								/>
							))}
						</View>
					)}
				</View>
			</ScrollView>
		</View>
	);
};

export default Saved;
