import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { supabase, hf } from "../utils/clients"

import { FormattedMovie } from './types';
import { FeatureExtractionOutput } from '@huggingface/inference';



export const embed = async(str: string) => {
    const embedding = await hf.featureExtraction({
        model: "sentence-transformers/all-mpnet-base-v2",
        // Model options:
        // sentence-transformers/all-mpnet-base-v2
        // sentence-transformers/all-MiniLM-L6-v2

        inputs: str
    })
    // console.log("DIRECTLY IN THE EMBED FUNCTION", embedding.length)
    return embedding
}

// Currently not in use
export const splitText = async(text: string) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 25,
    });

    const output = await splitter.createDocuments([text]);
    return output;
}

const storeEmbedding = async(id: number, embedding: FeatureExtractionOutput): Promise<undefined> => {
    // console.log("ABOUT TO BE STORED", embedding.length)
    const { error } = await supabase
        .from("movies")
        .update({ embedding: embedding })
        .eq("movie_id", id)

    if(error){
        console.error(error)
    }

    return
}

export const embedAndStoreDocument = async(document: FormattedMovie): Promise<undefined> => {
    // The below code was for splitting the input and then storing it.
    // This was later ditched so that each movie only has one embedding, however
    // this embedding can be passed into the user input function to find similar matches
    // I'm unsure if this is the best solution.

    // const chunkData = await splitText(document.description)
    // const data = await Promise.all(
    //     chunkData.map(async (chunk) => {
    //         try {
    //             const embeddingResponse = await embed(chunk.pageContent)
    //             return {
    //                 movie_id: document.id,
    //                 content: chunk.pageContent,
    //                 embedding: embeddingResponse
    //             }
    //         } catch (e) {
    //             console.error(e.message)
    //         }
    //     })
    // );

    // const data = {
    //     movie_id: document.id,
    //     content: document.description,
    //     embedding: embeddingResponse
    // }

    const embeddingResponse = await embed(document.description)
    // console.log("EMBEDDING RESPONSE", embeddingResponse.length)
    storeEmbedding(document.id, embeddingResponse)

    return
}
