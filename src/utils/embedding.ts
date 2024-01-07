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

    return embedding
}

// Not currently in use. I originally was going to split the description of each movie to get a better accuracy in matching, but this would require then averaging the embeddings
// back together to get something that represented the entire movie. The concept of averaging embeddings is still shaky to me and I haven't been able to find a resource
// that gives a definitive answer on the best way to do it. In other implementations, I simply took the average of dimension of two arrays divided by two.
export const splitText = async(text: string) => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 25,
    });

    const output = await splitter.createDocuments([text]);
    return output;
}

const storeEmbedding = async(id: string, embedding: FeatureExtractionOutput): Promise<undefined> => {
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
    storeEmbedding(document.id, embeddingResponse)

    return
}
