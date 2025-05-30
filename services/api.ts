export const TMDB_CONFIG = {
	BASE_URL: "https://api.themoviedb.org/3/",
	API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
	},
};

export const fetchMovies = async ({
	query,
	genreId,
}: {
	query: string;
	genreId?: number;
}) => {
	let endpoint = query
		? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
		: `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

	// Add genre filter if genreId is provided
	if (genreId) {
		endpoint += `&with_genres=${genreId}`;
	}

	const response = await fetch(endpoint, {
		method: "GET",
		headers: TMDB_CONFIG.headers,
	});

	if (!response.ok) {
		throw new Error("Failed to fetch movies");
	}

	const data = await response.json();
	return data.results;
};

export const fetchMovieDetails = async (
	movieId: string
): Promise<MovieDetails> => {
	try {
		const response = await fetch(
			`${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
			{
				method: "GET",
				headers: TMDB_CONFIG.headers,
			}
		);

		if (!response.ok) throw new Error("Failed to fetch movie details");

		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
