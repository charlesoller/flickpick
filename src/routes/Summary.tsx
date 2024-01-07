// Functions
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSpring, animated, useSpringRef } from '@react-spring/web'
import { parseMovieInfo } from "../utils/helper"
import { openai } from "../utils/clients"

// Components
import { Slider } from "../components/Slider"

// CSS
import styles from '../styles.module.css'

// Types
import { Movie } from "../utils/types"

export default function Summary(){
    const location = useLocation()
    const { liked } = location.state
    const [ response, setResponse ] = useState("")
    const moviesDescription = liked.map((movie: Movie) => parseMovieInfo(movie).description).join("\n#####\n")  //This takes the liked movies, parses the information formatted into a string, then joins them on separate lines

    const startFadeIn = useSpringRef()
    const fadeIn = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { tension: 80, friction: 60, mass: 2 },
        ref: startFadeIn
    })

    const instantFadeIn = useSpring({
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { tension: 80, friction: 60, mass: 2 },
    })

    useEffect(() => {
        const getAiSummary = async( description: string ): Promise<undefined> => {
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {"role": "system", "content": "You are a helpful movie expert. You will be given a list of movies and their descriptions that I liked, which are separated with '#####', please give me a brief and succint summary of my tastes and preferences in movies. Please address the user as 'you' and strictly limit your response to 50 words. The first word in your response should always be 'You'."},
                    {"role": "user", "content": description}
                  ],
                stream: true
            })

            for await (const part of completion){
                const message = part.choices[0].delta.content
                if(message){
                    setResponse(prevResponse => prevResponse + message)
                }
            }

            startFadeIn.start()
        }

        getAiSummary(moviesDescription)
    }, [])

    return (
        <main className="mt-20 mx-auto flex flex-col w-4/5">
            <animated.h1 className="text-5xl font-bold bg-gradient-to-b from-white/80 to-white/30 inline-block text-transparent bg-clip-text drop-shadow-xl mb-5" style={instantFadeIn}>Your Summary</animated.h1>
            <p className="text-lg text-white/90 sm:text-xl">{response}</p>

            <animated.section className={styles.main} style={fadeIn}>
                <Slider items={liked} width={window.innerWidth > 640 ? 350 : 250} visible={3}>
                {(movie: Movie) => (
                    <div className={`${styles.content} sm:mt-8`}>
                        <animated.div className={styles.image} style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})` }} />
                    </div>
                )}
                </Slider>
            </animated.section>
        </main>
    )
}
