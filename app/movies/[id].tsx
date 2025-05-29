import {
	View,
	Text,
	ScrollView,
	Image,
	TouchableOpacity,
	Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails } from "@/services/api";
import { icons } from "@/constants/icons";
import { getCurrentUser, updateUserPreferences } from "@/services/appwrite";

interface MovieInfoProps {
	label: string;
	value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
	<View className="flex-col items-start justify-center mt-5">
		<Text className="text-light-200 font-normal text-sm">{label}</Text>
		<Text className="text-light-100 font-bold text-sm mt-2">
			{value || "N/A"}
		</Text>
	</View>
);

const MovieDetails = () => {
	const { id } = useLocalSearchParams();
	const [isFavorite, setIsFavorite] = useState(false);
	const [loadingFavorite, setLoadingFavorite] = useState(false);

	const { data: movie, loading } = useFetch(() =>
		fetchMovieDetails(id as string)
	);

	useEffect(() => {
		const checkIfFavorite = async () => {
			try {
				const user = await getCurrentUser();
				if (user) {
					const prefs = await updateUserPreferences({}); // Empty update just to get current prefs
					const favorites = prefs.favorites || [];
					setIsFavorite(favorites.includes(id as string));
				}
			} catch (error) {
				console.error("Error checking favorites:", error);
			}
		};

		checkIfFavorite();
	}, [id]);

	const toggleFavorite = async () => {
		if (loadingFavorite) return;

		setLoadingFavorite(true);
		try {
			const user = await getCurrentUser();
			if (!user) {
				Alert.alert(
					"Please login",
					"You need to be logged in to save favorites"
				);
				return;
			}

			const prefs = await updateUserPreferences({}); // Get current prefs
			let favorites = prefs.favorites || [];

			if (isFavorite) {
				favorites = favorites.filter((favId: string) => favId !== id);
			} else {
				if (!favorites.includes(id as string)) {
					favorites = [...favorites, id];
				}
			}

			await updateUserPreferences({ favorites });
			setIsFavorite(!isFavorite);

			Alert.alert(
				isFavorite ? "Removed from favorites" : "Added to favorites",
				isFavorite
					? "This movie was removed from your favorites"
					: "This movie was added to your favorites"
			);
		} catch (error) {
			console.error("Error updating favorites:", error);
			Alert.alert("Error", "Failed to update favorites");
		} finally {
			setLoadingFavorite(false);
		}
	};

	return (
		<View className="bg-primary flex-1">
			<ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
				<View>
					<Image
						className="w-full h-[550px]"
						resizeMode="stretch"
						source={{
							uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
						}}
					/>
				</View>

				<View className="flex-col items-start justify-center mt-5 px-5">
					<View className="flex-row justify-between items-center w-full">
						<Text className="text-white font-bold text-xl">{movie?.title}</Text>
						<TouchableOpacity
							onPress={toggleFavorite}
							disabled={loadingFavorite}
						>
							{/* <Image
								source={isFavorite ? icons.heartFilled : icons.heartOutline}
								className="size-6"
								tintColor={isFavorite ? "#FF0000" : "#FFFFFF"}
							/> */}
						</TouchableOpacity>
					</View>

					<View className="flex-row items-center gap-x-1 mt-2">
						<Text className="text-light-200 text-sm">
							{movie?.release_date?.split("-")[0]}
						</Text>
						<Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
					</View>
					<View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
						<Image source={icons.star} className="size-4" />
						<Text className="text-white font-bold text-sm">
							{Math.round(((movie?.vote_average ?? 0) * 100) / 100)}/10
						</Text>
						<Text className="text-light-200 text-sm">
							({movie?.vote_count} votes)
						</Text>
					</View>

					<MovieInfo label="Overview" value={movie?.overview} />
					<MovieInfo
						label="Genres"
						value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}
					/>
					<View className="flex flex-row justify-between w-1/2">
						<MovieInfo
							label="Budget"
							// @ts-ignore
							value={`$${movie?.budget / 1_000_000} millions`}
						/>
						<MovieInfo
							label="Revenue"
							// @ts-ignore
							value={`$${Math.round(movie?.revenue) / 1_000_000}`}
						/>
					</View>

					<MovieInfo
						label="Production Companies"
						value={
							movie?.production_companies.map((c) => c.name).join(" - ") ||
							"N/A"
						}
					/>
				</View>
			</ScrollView>

			<View className="absolute bottom-5 left-0 right-0 flex-row justify-between px-5">
				<TouchableOpacity
					className="bg-accent rounded-lg py-3.5 flex-1 mr-2 flex-row items-center justify-center"
					onPress={router.back}
				>
					<Image
						source={icons.arrow}
						className="size-5 mr-1 mt-0.5 rotate-180"
						tintColor="#fff"
					/>
					<Text className="text-white font-semibold text-base">Go back</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="bg-red-500 rounded-lg py-3.5 flex-row items-center justify-center px-4"
					onPress={toggleFavorite}
					disabled={loadingFavorite}
				>
					{/* <Image
						source={isFavorite ? icons.heartFilled : icons.heartOutline}
						className="size-5 mr-1"
						tintColor="#FFFFFF"
					/> */}
					<Text className="text-white font-semibold text-base">
						{isFavorite ? "Favorited" : "Favorite"}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default MovieDetails;
