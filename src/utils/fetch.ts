import { moviedb, supabase } from "./clients"
import { addMovieToSupabase, parseMovieInfo } from "./helper"
import { embedAndStoreDocument } from "./embedding"

export const loadMovies = async () => {
    // I keep running into issues with HuggingFace running out of calls,
    // Need to use custom endpoint probably for initial load
    const PAGE_COUNT = 5
    const movieArr = []

    for (let i = 1; i < PAGE_COUNT + 1; i++){
        const page = await moviedb.discoverMovie({page: i})
        movieArr.push(...page.results!)
    }

    return movieArr
}

export const fetchMovies = async () => {
    const { data, error } = await supabase
        .from('movies')
        .select()

    if(error){
        console.error(error)
    }

    return data
}

export const fetchMovie = async (id: number) => {
    const { data, error } = await supabase
        .from('movies')
        .select()
        .eq("movie_id", id)

    if(error){
        console.error(error)
    }

    return data
}

export const getCurrentMovieIds = async() => {
    const { data, error } = await supabase
        .from("movies")
        .select("movie_id")

    if (error){
        console.error(error.message)
        return null
    } else {
        const idArr = data.map(movie => movie.movie_id)
        return idArr
    }
}

// Fetches 100 most popular movies from TMDB, and embeds/uploads to Supabase if they aren't already there.
// Then fetches entire list of movies from Supabase, and returns the movies and the number of new movies added.
export const fetchAndLoadNewMovies = async() => {
    const movieArr = await loadMovies();    // Loads the 100 current most popular movies from TMDB
    const currentMovieIds = await getCurrentMovieIds();     // List of movie IDs already in Supabase
    const count = 0;      // Tracks the number of new movies added

    // This part is for storing any new movies that may not already be in Supabase
    movieArr.forEach(async (movie) => {
        if(!currentMovieIds?.includes(movie.id)){
            count++
            //Adds movie with info to Supabase
            await addMovieToSupabase(movie)

            // Deals with creating string from raw data and then embedding and storing in Supabase with ID to link to movie table
            const movieObj = parseMovieInfo(movie)
            await embedAndStoreDocument(movieObj)
        }
    })

    const movies = await fetchMovies();
    return { movies, count }
}
