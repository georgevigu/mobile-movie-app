import { Client, Databases, Account, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
	.setEndpoint("https://cloud.appwrite.io/v1")
	.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);
const database = new Databases(client);

export const login = async (email: string, password: string) => {
	try {
		// await account.deleteSession("current"); // Ensure no previous session exists
		await account.createEmailPasswordSession(email, password);
		return await account.get();
	} catch (error) {
		console.log("Login Error:", error);
		throw error;
	}
};

export const register = async (email: string, password: string) => {
	try {
		await account.create(ID.unique(), email, password);
		return await login(email, password);
	} catch (error) {
		console.log("Register Error:", error);
		throw error;
	}
};

export const getCurrentUser = async () => {
	try {
		return await account.get();
	} catch (error) {
		console.error("Failed to get user:", error);
		return null;
	}
};

export const updateUsername = async (username: string) => {
	try {
		return await account.updateName(username);
	} catch (error) {
		console.error("Failed to update username:", error);
		throw error;
	}
};

export const logout = async () => {
	try {
		await account.deleteSession("current");
	} catch (error) {
		console.error("Logout Error:", error);
		throw error;
	}
};

export const updateUserPreferences = async (prefs: Record<string, any>) => {
	try {
		// Get current preferences first to merge them
		const currentPrefs = await account.getPrefs();

		// Update with new preferences (merges with existing)
		const updatedPrefs = { ...currentPrefs, ...prefs };

		// Save to Appwrite
		await account.updatePrefs(updatedPrefs);

		return updatedPrefs;
	} catch (error) {
		console.error("Failed to update preferences:", error);
		throw error;
	}
};

// Specific function for updating genres
export const updateFavoriteGenres = async (genres: string[]) => {
	try {
		return await updateUserPreferences({ genres });
	} catch (error) {
		console.error("Failed to update genres:", error);
		throw error;
	}
};

// Function to get user preferences
export const getUserPreferences = async () => {
	try {
		return await account.getPrefs();
	} catch (error) {
		console.error("Failed to get preferences:", error);
		return {};
	}
};

export const updateSearchCount = async (query: string, movie: Movie) => {
	try {
		const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.equal("searchTerm", query),
		]);

		if (result.documents.length > 0) {
			const existingMovie = result.documents[0];

			await database.updateDocument(
				DATABASE_ID,
				COLLECTION_ID,
				existingMovie.$id,
				{
					count: existingMovie.count + 1,
				}
			);
		} else {
			await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
				searchTerm: query,
				movie_id: movie.id,
				count: 1,
				title: movie.title,
				poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
			});
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getTrendingMovies = async (): Promise<
	TrendingMovie[] | undefined
> => {
	try {
		const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
			Query.limit(5),
			Query.orderDesc("count"),
		]);

		return result.documents as unknown as TrendingMovie[];
	} catch (error) {
		console.log(error);
		return undefined;
	}
};
