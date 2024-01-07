import { supabase } from "./clients.ts"
import { Movie, Recommendation, EmbeddingData } from "./types.ts"

export const nextRecommendation = async (embeddedQuery: EmbeddingData, seen: Set<string>, movies: Array<Movie>) => {
    // Calls cosine search function from Supabase Postgre
    // A high match count is recommended here even though only one will be shown to the user
    // This is becuase of the filter down below, all of the closest matches will be returned, even if they've already been seen
    // A match count of something like 10 will likely run out fairly soon if the user keeps swiping as all of the movies will have already
    // been seen by the user. Because the movies seen and the search function are stored locally and in Supabase respectively, the match_embeddings
    // function would have to be refactored to take in the seen parameter to avoid this.
    const { data } = await supabase.rpc("match_embeddings", {
        query_embedding: embeddedQuery,
        match_threshold: 0,
        match_count: 100
    })

    const options = data.filter((item: Recommendation) => !seen.has(item.id))
    // console.log("OPTIONS", options)      //IMPORTANT CONSOLE LOG FOR DEBUG -- this will return a list of all options after being filtered, useful in tracking if a user is running out of reccomendations
    const match = options[0]

    // This returns the index of the match for use in Deck component
    for(let i = 0; i < movies.length; i++){
        if(movies[i].movie_id === match.id){
            return i;
        }
    }

    //Throw error here?
    throw new Error("No movies found.")
    return null
}

// ADD THESE TYPES: USER PREF CAN BE STRING OR ARRAY
export const averageEmbeddings = (firstEmbedding: EmbeddingData, secondEmbedding: EmbeddingData) => {
    // Embeddings passed in MUST be the EXACT same number of dimensions


    // This will only be a string if it's fetched directly from Supabase, then will have to be parsed
    // Once it's flowing, it will be functioning as a 768D array (only with current model)
    if(typeof firstEmbedding === "string"){
        firstEmbedding = JSON.parse(firstEmbedding)
    }
    if(typeof secondEmbedding === "string"){
        secondEmbedding = JSON.parse(secondEmbedding)
    }

    const averageEmbedding = new Array(768)    //In this case, the model is outputting vectors of 768 dimensions
    for(let i = 0; i < firstEmbedding.length; i++){
        //@ts-ignore
        // This was giving the error that the embeddings couldn't be added like this because they have string in their type.
        // While this is true, they are parsed into an array if needed above, so they will ALWAYS be in an array format here.
        // A stronger solution might be to make sure to parse them before being passed here, but I think that that makes this function
        // more error prone.
        averageEmbedding[i] = (firstEmbedding[i] + secondEmbedding[i]) / 2
    }

    return averageEmbedding
}

export const inverseEmbedding = (embedding: EmbeddingData) => {
    if(typeof embedding === "string"){
        embedding = JSON.parse(embedding)
    }

    //@ts-ignore
    //This will always be an array because it is parsed above.
    const inverse = embedding.map(item => item *= -1)
    return inverse
}

// This function takes a target embedding and a modifier embedding, and creates an embedding that
// is scale degrees closer to the target embedding. For example (0 represents inverse, 1 is original):
// (0) ----- 0.5 ----- 1      ===> 0 degrees would return the inverse
// 0 ----- (0.5) ----- 1      ===> 1 degree would return the exact average
// 0 ----- 0.5 -- (0.75) -- 1 ===> 2 degrees would return 3/4 of the original
// 3 degrees would return 0.875 (7/8) of the original
// and so on...
// Note that this is done by repeatedly averaging two embeddings, so I'm unsure of the exact preciseness of this approach.
// This also gets O(n) more costly with each increase of scale
export const adjustSimilarity = (targetEmbedding: EmbeddingData, modifierEmbedding: EmbeddingData, scale: number) => {
    let resultEmbedding = modifierEmbedding;
    for (let i = 0; i < scale; i++){
        resultEmbedding = averageEmbeddings(resultEmbedding, targetEmbedding)
    }

    return resultEmbedding;
}
