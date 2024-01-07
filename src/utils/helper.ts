import { supabase } from "../utils/clients"
import { Movie, FormattedMovie } from "./types"

export const genreFromGenreId = (id: number): string => {
    if(id === 28) return "Action"
    if(id === 12) return "Adventure"
    if(id === 16) return "Animation"
    if(id === 35) return "Comedy"
    if(id === 80) return "Crime"
    if(id === 99) return "Documentary"
    if(id === 18) return "Drama"
    if(id === 10751) return "Family"
    if(id === 14) return "Fantasy"
    if(id === 36) return "History"
    if(id === 27) return "Horror"
    if(id === 10402) return "Music"
    if(id === 9648) return "Mystery"
    if(id === 10746) return "Romance"
    if(id === 878) return "Science Fiction"
    if(id === 10770) return "TV Movie"
    if(id === 53) return "Thriller"
    if(id === 10752) return "War"
    if(id === 37) return "Western"

    //Consider throwing error here? I ended up handling this checking in client if it's an empty string and not displaying if so.
    return ""
}

export const parseMovieInfo = (movie: Movie): FormattedMovie => {
    const { movie_id, genre_ids, overview, release_date, title } = movie

    const genreNames = genre_ids!.map(id => genreFromGenreId(id)).join(", ")

// This is moved back due to Javascript preserving whitespace in template literals
const movieText =
`Movie Title: ${title}
Genre(s): ${genreNames}
Release Date: ${release_date}

Description: ${overview}`

    const output = {id: movie_id!, description: movieText}
    return output
}

//This only runs if the movie is not already in Supabase
export const addMovieToSupabase = async (movie: Movie): Promise<undefined> => {
    const { movie_id, genre_ids, overview, release_date, title, poster_path } = movie
    const { error } = await supabase
        .from("movies")
        .insert({
            movie_id,
            genre_ids,
            overview,
            release_date,
            title,
            poster_path
        })

    if (error) {
        // This is the error code for a duplicate add
        error.code === "23505" ? null : console.error(error.message)
    }

    return
}
