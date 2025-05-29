import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
	Text,
	View,
	Image,
	ScrollView,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
} from "react-native";
import TrendingCard from "@/components/trendingCard";
import { useRouter } from "expo-router";
import useFetch from "../../services/useFetch";
import { fetchMovies } from "../../services/api";
import MovieCard from "@/components/movieCard";
import { getTrendingMovies } from "@/services/appwrite";
import { genres } from "@/constants/genres";
import { useState } from "react";

export default function Index() {
	const router = useRouter();
	const [selectedGenre, setSelectedGenre] = useState<number | undefined>(
		undefined
	);

	const {
		data: trendingMovies,
		loading: trendingLoading,
		error: trendingError,
	} = useFetch(getTrendingMovies);

	const {
		data: movies,
		loading: moviesLoading,
		error: moviesError,
		refetch: refetchMovies,
	} = useFetch(() => fetchMovies({ query: "", genreId: selectedGenre }));

	const handleGenrePress = async (genreId: number) => {
		const newSelectedGenre = selectedGenre === genreId ? undefined : genreId;
		setSelectedGenre(newSelectedGenre);
		// Refetch movies when genre changes
		await refetchMovies();
	};

	return (
		<View className="flex-1 bg-primary">
			<Image source={images.bg} className="absolute w-full z-0" />
			<ScrollView
				className="flex-1 px-5 py-5"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
			>
				<Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

				{moviesLoading || trendingLoading ? (
					<ActivityIndicator
						size="large"
						color="#0000ff"
						className="mt-10 self-center"
					/>
				) : moviesError || trendingError ? (
					<Text>Error: {moviesError?.message || trendingError?.message}</Text>
				) : (
					<View className="flex-1 mt-5">
						{trendingMovies && (
							<View className="mt-5">
								<Text className="text-2xl text-white font-bold mb-3">
									Trending Movies
								</Text>
								<FlatList
									horizontal
									showsHorizontalScrollIndicator={false}
									ItemSeparatorComponent={() => <View className="w-4" />}
									className="mb-4 mt-3"
									data={trendingMovies}
									renderItem={({ item, index }) => (
										<TrendingCard movie={item} index={index} />
									)}
									keyExtractor={(item) => item.movie_id.toString()}
								/>
							</View>
						)}
						<>
							<FlatList
								data={genres}
								horizontal
								showsHorizontalScrollIndicator={false}
								keyExtractor={(item) => item.id.toString()}
								ItemSeparatorComponent={() => <View className="w-2" />}
								className="mt-2"
								renderItem={({ item }) => (
									<TouchableOpacity
										onPress={() => handleGenrePress(item.id)}
										className={`border px-4 py-2 rounded-full ${
											selectedGenre === item.id
												? "bg-[#AB8BFF] border-[#AB8BFF]"
												: "bg-white/20 border-white/30"
										}`}
									>
										<Text className={`font-medium text-sm text-white`}>
											{item.name}
										</Text>
									</TouchableOpacity>
								)}
								contentContainerStyle={{ paddingVertical: 8 }}
							/>

							<Text className="text-2xl text-white font-bold mt-5 mb-3">
								{selectedGenre
									? `${genres.find((g) => g.id === selectedGenre)?.name} Movies`
									: "Latest Movies"}
							</Text>

							<FlatList
								data={movies}
								renderItem={({ item }) => <MovieCard {...item} />}
								keyExtractor={(item) => item.id.toString()}
								numColumns={3}
								columnWrapperStyle={{
									justifyContent: "flex-start",
									gap: 20,
									paddingRight: 5,
									marginBottom: 10,
								}}
								className="mt-2 pb-32"
								scrollEnabled={false}
							/>
						</>
					</View>
				)}
			</ScrollView>
		</View>
	);
}
