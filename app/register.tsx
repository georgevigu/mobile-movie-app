import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Image,
	Alert,
} from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { register } from "@/services/appwrite";

export default function Register() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const router = useRouter();

	async function handleRegister() {
		if (!email || !password || !confirmPassword) {
			Alert.alert("Error", "Please fill out all fields.");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Error", "Passwords do not match.");
			return;
		}

		const user = await register(email, password);

		if (user) {
			router.push("/(tabs)"); 
		} else {
			Alert.alert("Error", "Registration failed. Please try again.");
		}
	}

	return (
		<View className="flex-1 bg-primary">
			<Image source={images.bg} className="absolute w-full z-0" />
			<ScrollView
				className="flex-1 px-5"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
			>
				<Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
				<Text className="text-white text-5xl mt-10">Create Account</Text>
				<Text className="text-[#a8b5db] mt-5">
					Register to start watching your favourite movies.
				</Text>
				<View className="flex-row items-center bg-white rounded-2xl mt-10 px-4 py-3">
					<TextInput
						placeholder="Email"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
						placeholderTextColor="#8897ad"
						className="flex-1 ml-2 text-gray-500"
					/>
				</View>
				<View className="flex-row items-center bg-white rounded-2xl mt-5 px-4 py-3">
					<TextInput
						placeholder="Password"
						secureTextEntry
						autoCapitalize="none"
						value={password}
						onChangeText={setPassword}
						placeholderTextColor="#8897ad"
						className="flex-1 ml-2 text-gray-500"
					/>
				</View>
				<View className="flex-row items-center bg-white rounded-2xl mt-5 px-4 py-3">
					<TextInput
						placeholder="Confirm Password"
						secureTextEntry
						autoCapitalize="none"
						value={confirmPassword}
						onChangeText={setConfirmPassword}
						placeholderTextColor="#8897ad"
						className="flex-1 ml-2 text-gray-500"
					/>
				</View>

				<TouchableOpacity
					className="flex-row justify-center bg-[#162d3a] rounded-2xl mt-5 px-4 py-5"
					onPress={handleRegister}
				>
					<Text className="text-white">Register</Text>
				</TouchableOpacity>

				<View className="flex-row justify-end mt-3">
					<TouchableOpacity onPress={() => router.push("/")}>
						<Text className="text-[#313957]">
							Already have an account?
							<Text className="text-[#1E4AE9]"> Sign in</Text>
						</Text>
					</TouchableOpacity>
				</View>
				<View className="absolute bottom-20 w-full items-center">
					<Text className="text-[#a8b5db] text-md uppercase">
						© 2025 All rights reserved
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}
