export default function About(){
    return (
        <main className="mt-20 mx-auto w-4/5 height-sm:mt-16">
            <h1 className="text-4xl height-sm:text-xl height-sm:hidden sm:text-5xl font-bold bg-gradient-to-b from-white/80 to-white/30 inline-block text-transparent bg-clip-text drop-shadow-xl mb-8">About FlickPick</h1>
            <p className="text-sm text-white/90 sm:text-xl height-sm:text-xs">
                FlickPick was developed by Charles Oller using
                <a target="_blank" href="https://react.dev/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> React </a>
                with
                <a target="_blank" href="https://www.typescriptlang.org/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> TypeScript</a>
                , and many open source libraries for
                <a target="_blank" href="https://react.dev/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> React</a>
                , such as
                <a target="_blank" href="https://tailwindcss.com/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> Tailwind</a>
                ,
                <a target="_blank" href="https://use-gesture.netlify.app/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> Use-Gesture</a>
                , and
                <a target="_blank" href="https://www.react-spring.dev/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> React-Spring</a>
                .
            </p>
            <br />
            <p className="text-sm text-white/90 sm:text-xl height-sm:text-xs">
                This application makes use of AI technologies, such as embeddings, similarity searching and chat completions.
                <a target="_blank" href="https://huggingface.co/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> Hugging Face </a>
                was used for embedding the user's choices, which can then be used to find other movies
                similar to the movies liked by the user. In particular, the model used for this is
                <a target="_blank" href="https://huggingface.co/sentence-transformers/all-mpnet-base-v2" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> sentence-transformers/all-mpnet-base-v2</a>
                . The
                <a target="_blank" href="https://openai.com/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> OpenAI </a>
                chat completion API was used for the final summary of the user's preferences, as I found that open source options were greatly lacking in comparison.
                <a target="_blank" href="https://supabase.com/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> Supabase </a>
                with the
                <a target="_blank" href="https://github.com/pgvector/pgvector" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> pgvector </a>
                plugin used to store these embeddings and other movie information.
            </p>
            <br />
            <p className="text-sm text-white/90 sm:text-xl height-sm:text-xs">
                All movies and information are sourced from
                <a target="_blank" href="https://www.themoviedb.org/?language=en-US" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> The Movie Database (TMDB)</a>
                , and this application was initially seeded with the 1000 most popular movies as of 01/04/24. The application is set up to pull the 50 most popular movies
                at the time it is accessed, and add them to the database if one of them is not currently stored.
            </p>
            <br />
            <p className="text-sm text-white/90 sm:text-xl height-sm:text-xs">
                The background is a slightly modified version of the background used by
                <a target="_blank" href="https://stripe.com/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> Stripe </a>
                and is available
                <a target="_blank" href="https://whatamesh.vercel.app/" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> openly to the public</a>
            </p>
            <br />
            <p className="text-sm text-white/90 sm:text-xl height-sm:text-xs">
                This application represents one of my first experiments in AI and gesture based navigation. The Github repo for this project is available
                <a target="_blank" href="https://github.com/charlesoller/flickpick" className="hover:text-green-400 transition ease-in-out duration-300 font-semibold"> here. </a>
                Please note that this project is still under light development.
            </p>
        </main>
    )
}
