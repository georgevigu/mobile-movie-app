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
import { login } from "@/services/appwrite";

export default function Index() {
	const [email, setEmail] = useState("vigu.george@gmail.com");
	const [password, setPassword] = useState("12345678");
	const router = useRouter();

	async function handleLogin() {
		if (!email || !password) {
			Alert.alert("Error", "Please enter both email and password.");
			return;
		}

		try {
			await login(email, password);
			router.replace("/(tabs)"); // Navigate to your main app screen
		} catch (err: any) {
			Alert.alert("Login failed", err.message || "Please try again.");
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
				<Text className="text-white text-5xl mt-10">Welcome back 👋</Text>
				<Text className="text-[#a8b5db] mt-5">
					Sign in to start watching your favourite movies.
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

				<TouchableOpacity
					className="flex-row justify-center bg-[#162d3a] rounded-2xl mt-5 px-4 py-5"
					onPress={handleLogin}
				>
					<Text className="text-white">Sign in</Text>
				</TouchableOpacity>
				<View className="flex-row justify-end mt-3">
					<TouchableOpacity onPress={() => router.push("/register")}>
						<Text className="text-[#313957]">
							Don't have an account?
							<Text className="text-[#1E4AE9]"> Register here</Text>
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
