import React, { useState } from "react";
import { useRouter } from "expo-router";
import {
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Image,
} from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

export default function Index() {
	const [email, setEmail] = useState("");
	const router = useRouter();

	function handleLogin() {
		router.push("/(tabs)");
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
						onChangeText={(text: string) => setEmail(text)}
						placeholderTextColor="#8897ad"
						className="flex-1 ml-2 text-gray-500"
					/>
				</View>
				<View className="flex-row items-center bg-white rounded-2xl mt-5 px-4 py-3">
					<TextInput
						placeholder="Password"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={(text: string) => setEmail(text)}
						placeholderTextColor="#8897ad"
						className="flex-1 ml-2 text-gray-500"
					/>
				</View>

				<View className="bg-[#162d3a] rounded-2xl mt-5 px-4 py-5">
					<TouchableOpacity
						className="flex-row justify-center"
						onPress={handleLogin}
					>
						<Text className="text-white">Sign in</Text>
					</TouchableOpacity>
				</View>

				{/* <TextInput
					// style={styles.input}
					placeholder="Password"
					secureTextEntry
					autoCapitalize="none"
					// value={password}
					// onChangeText={setPassword}
				/> */}

				{/* {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )} */}
				<TouchableOpacity>
					<Text>Don't have an account? Register here.</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	);
}
