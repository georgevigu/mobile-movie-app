import {
	View,
	Text,
	Image,
	TouchableOpacity,
	Modal,
	TextInput,
	Button,
	Platform,
	ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import {
	getCurrentUser,
	updateUsername,
	logout,
	updateFavoriteGenres,
	getUserPreferences,
} from "@/services/appwrite";

const GENRES = [
	"Action",
	"Adventure",
	"Animation",
	"Comedy",
	"Crime",
	"Documentary",
	"Drama",
	"Family",
	"Fantasy",
	"Horror",
	"Mystery",
	"Romance",
	"Science Fiction",
	"Thriller",
	"War",
	"Western",
];

const getGmailUsername = (email: string): string => {
	if (email.endsWith("@gmail.com")) {
		return email.replace("@gmail.com", "");
	}
	return email;
};

const Profile = () => {
	const [email, setEmail] = useState<string | null>(null);
	const [name, setName] = useState<string | null>(null);
	const [isModalVisible, setModalVisible] = useState(false);
	const [newName, setNewName] = useState("");
	const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
	const [isGenreModalVisible, setGenreModalVisible] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			const user = await getCurrentUser();
			if (user) {
				setEmail(user.email);
				if (user.name) {
					setName(user.name);
				} else {
					setName(getGmailUsername(user.email));
				}
				const prefs = await getUserPreferences();
				if (prefs.genres) {
					setSelectedGenres(prefs.genres);
				}
			}
		};

		fetchUser();
	}, []);

	const handleEditPress = () => {
		setNewName(name ?? "");
		setModalVisible(true);
	};

	const handleSaveName = async () => {
		const trimmedName = newName.trim();
		if (trimmedName === "") return;

		try {
			await updateUsername(trimmedName); // ⬅️ Update name in Appwrite backend
			setName(trimmedName); // Update local state
			setModalVisible(false); // Close the modal
		} catch (error) {
			console.error("Failed to update name:", error);
		}
	};

	const handleLogout = async () => {
		try {
			await logout();
			router.replace("/"); // Go to login screen
			console.log("Logged out successfully");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	const toggleGenre = (genre: string) => {
		setSelectedGenres((prev) =>
			prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
		);
	};

	const saveSelectedGenres = async () => {
		try {
			await updateFavoriteGenres(selectedGenres);
			setGenreModalVisible(false);
		} catch (error) {
			console.error("Failed to save genres:", error);
		}
	};

	return (
		<View className="bg-primary flex-1">
			<Image source={images.bg} className="absolute w-full z-0 " />
			<Image
				source={icons.logo}
				className="w-12 h-10 mt-20 mb-20 z-2 mx-auto"
			/>

			<ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
				<View className="flex flex-row gap-5 px-8">
					<View>
						<Image source={images.genericAvatar} />
					</View>
					<View className="gap-2">
						<Text className="text-white text-xl">{name}</Text>
						{email && (
							<Text className="text-gray-500 text-lg">Email: {email}</Text>
						)}
						<TouchableOpacity
							onPress={handleLogout}
							className="bg-[#AB8BFF] px-6 py-3 rounded-md w-2/3"
						>
							<Text className="text-black text-lg font-bold">Log Out</Text>
						</TouchableOpacity>
					</View>
					<View>
						<TouchableOpacity onPress={handleEditPress}>
							<Image source={icons.pencil} />
						</TouchableOpacity>
					</View>
				</View>

				{/* Interests Section */}
				<View className="mt-10 px-8">
					<Text className="text-white text-lg font-semibold mb-2">
						Your Interests
					</Text>
					<View className="flex-row flex-wrap gap-2 mb-3">
						{selectedGenres.length === 0 ? (
							<Text className="text-gray-400">No interests selected.</Text>
						) : (
							selectedGenres.map((genre) => (
								<View
									key={genre}
									className="bg-[#221F3D] px-3 py-1 rounded-md mb-2 mr-2"
								>
									<Text className="text-white">{genre}</Text>
								</View>
							))
						)}
					</View>
					<TouchableOpacity
						onPress={() => setGenreModalVisible(true)}
						className="bg-[#AB8BFF] px-4 py-2 rounded-md w-1/2"
					>
						<Text className="text-black text-center">Choose Interests</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>

			{/* Modal for editing name */}
			<Modal visible={isModalVisible} transparent animationType="fade">
				<View className="flex-1 justify-center items-center bg-black/50 px-6">
					<View className="bg-white w-full p-6 rounded-xl">
						<Text className="text-lg font-bold mb-2">Edit Username</Text>
						<TextInput
							className="border border-gray-300 rounded px-4 py-2 mb-4"
							value={newName}
							onChangeText={setNewName}
							placeholder="Enter new username"
						/>
						<View className="flex-row justify-end gap-4">
							<Button title="Cancel" onPress={() => setModalVisible(false)} />
							<Button title="Save" onPress={handleSaveName} />
						</View>
					</View>
				</View>
			</Modal>

			{/* Modal for choosing interests */}
			<Modal visible={isGenreModalVisible} transparent animationType="fade">
				<View className="flex-1 justify-center items-center bg-black/50 px-6">
					<View className="bg-white w-full p-6 rounded-xl max-h-[80%]">
						<Text className="text-lg font-bold mb-4">
							Select Your Interests
						</Text>
						<ScrollView
							contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap" }}
						>
							{GENRES.map((genre) => (
								<TouchableOpacity
									key={genre}
									onPress={() => toggleGenre(genre)}
									className={`px-3 py-2 m-1 rounded-full border ${
										selectedGenres.includes(genre)
											? "bg-[#1E4AE9] border-[#1E4AE9]"
											: "bg-white border-gray-300"
									}`}
								>
									<Text
										className={
											selectedGenres.includes(genre)
												? "text-white"
												: "text-black"
										}
									>
										{genre}
									</Text>
								</TouchableOpacity>
							))}
						</ScrollView>
						<View className="flex-row justify-end gap-4 mt-4">
							<Button
								title="Cancel"
								onPress={() => setGenreModalVisible(false)}
							/>
							<Button title="Save" onPress={saveSelectedGenres} />
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

export default Profile;
