import { update } from "@react-spring/web";
import { supabase } from "./clients";
import { fetchMovie } from "./fetch";

export const nextRecommendation = async (embeddedQuery: Array, seen: Set<string>, movies) => {
    // console.log("USER LIKE: ", embeddedQuery)
    const { data } = await supabase.rpc("match_embeddings", {
        query_embedding: embeddedQuery,
        match_threshold: 0,
        match_count: 100
    })

    const options = data.filter((item: {}) => !seen.has(item.id))
    // console.log("OPTIONS", options)      //IMPORTANT CONSOLE LOG FOR DEBUG
    const match = options[0]
    // console.log(match)
    // const matchInfo = await fetchMovie(match.id) //Only for testing purposes

    // This returns the index of the match for use in Deck component
    for(let i = 0; i < movies.length; i++){
        if(movies[i].movie_id === match.id){
            // console.log(match)
            return i;
        }
    }

    //Throw error here?
    return null
}

// export const userDislike = (userPreference, seen, movies) => {

// }

// ADD THESE TYPES: USER PREF CAN BE STRING OR ARRAY
export const averageEmbeddings = (firstEmbedding, secondEmbedding) => {
    // Embeddings passed in MUST be the EXACT same number of dimensions


    // This will only be a string if it's fetched directly from Supabase, then will have to be parsed
    // Once it's flowing, it will be functioning as a 768D array
    if(typeof firstEmbedding === "string"){
        firstEmbedding = JSON.parse(firstEmbedding)
    }
    if(typeof secondEmbedding === "string"){
        secondEmbedding = JSON.parse(secondEmbedding)
    }

    const averageEmbedding = new Array(768)    //In this case, the model is outputting vectors of 768 dimensions
    for(let i = 0; i < firstEmbedding.length; i++){
        averageEmbedding[i] = (firstEmbedding[i] + secondEmbedding[i]) / 2
    }

    return averageEmbedding
}

export const inverseEmbedding = (embedding) => {
    if(typeof embedding === "string"){
        embedding = JSON.parse(embedding)
    }

    // console.log("BEFORE: ", embedding)
    const inverse = embedding.map(item => item *= -1)
    // console.log("AFTER: ", inverse)
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
export const adjustSimilarity = (targetEmbedding, modifierEmbedding, scale) => {
    let resultEmbedding = modifierEmbedding;
    for (let i = 0; i < scale; i++){
        resultEmbedding = averageEmbeddings(resultEmbedding, targetEmbedding)
    }

    return resultEmbedding;
}
