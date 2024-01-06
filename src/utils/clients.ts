import { createClient } from "@supabase/supabase-js";
import { HfInference } from '@huggingface/inference'
import { MovieDb } from "moviedb-promise"
import { OpenAI } from "openai";

export const hf = new HfInference(import.meta.env.VITE_HUGGINGFACEHUB_PRO_API_KEY)
export const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_API_KEY
);
export const moviedb = new MovieDb(import.meta.env.VITE_OMDB_API_KEY)
export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})
