import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants/icons";

interface MovieCardProps {
	movie: any;
	onPress: () => void;
}

const BigMovieCard = ({ movie, onPress }: MovieCardProps) => (
	<TouchableOpacity className="mb-4 mx-2 w-[45%]" onPress={onPress}>
		<Image
			source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
			className="w-full h-64 rounded-lg"
			resizeMode="cover"
		/>
		<Text className="text-white mt-2 text-sm font-semibold" numberOfLines={1}>
			{movie.title}
		</Text>
		<View className="flex-row items-center mt-1">
			<Image source={icons.star} className="w-3 h-3 mr-1" />
			<Text className="text-light-200 text-xs">
				{movie.vote_average?.toFixed(1)}
			</Text>
		</View>
	</TouchableOpacity>
);

export default BigMovieCard;
