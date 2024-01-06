import { SetStateAction } from "react";

export interface Movie {
    adult?: boolean;
    backdrop_path?: string;
    genre_ids?: number[];
    movie_id?: string;
    original_language?: string;
    original_title?: string;
    overview?: string;
    popularity?: number;
    poster_path?: string;
    release_date?: string;
    title?: string;
    video?: boolean;
    vote_average?: number;
    vote_count?: number;
    embedding: string | SetStateAction<never[]>;
}

export interface FormattedMovie {
    id: number;
    description: string
}

// Currently not using
// export interface EmbeddingData {
//     movie_id: number;
//     content: string;
//     embedding: number[];
// }
