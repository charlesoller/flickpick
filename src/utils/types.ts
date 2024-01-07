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
    embedding?: string | number[];
}

export interface FormattedMovie {
    id: string;
    description: string
}

export interface Recommendation {
    id: string,
    content: string,
    similarity: number
}

export type EmbeddingData = Array<number> | string
