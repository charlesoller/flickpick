//  Functions
import { useState } from 'react'
import { useSprings, useSpring, animated, to as interpolate } from '@react-spring/web'
import { useDrag } from '@use-gesture/react'
import { genreFromGenreId } from "../utils/helper"
import { nextRecommendation, averageEmbeddings, inverseEmbedding, adjustSimilarity } from '../utils/similaritySearch'

//  Components
import { Link } from "react-router-dom"
import Toggle from './Toggle'

// Types
import { Movie } from '../utils/types'
type StringSet = Set<string>
type NumberSet = Set<number>

// CSS
import styles from '../styles.module.css'


  // These two are just helpers, they curate spring data, values that are later being interpolated into css
  const to = (i: number) => ({
    x: 0,
    y: i,
    scale: 1,
    rot: 0,
    delay: i * 100,
    opacity: 1
  })
  const from = (_i: number) => ({ x: 0, rot: 0, scale: 0.5, y: 0, opacity: 0 })
  // This is being used down there in the view, it interpolates rotation and scale into a css transform
  const trans = (r: number, s: number) =>
    `rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`

  const generateRandomIndex = function ( arr: Array<any> ): number {
    return Math.floor(Math.random() * arr.length);
  }

  export default function Deck({ movies }: { movies: Movie[] }) {
    const [ left ] = useState<NumberSet>(() => new Set()); // This is a set that flags all of the index of cards that are flicked out left
    const [ right ] = useState<NumberSet>(() => new Set()); // This is a set that flags all of the index of cards that are flicked out right
    const [ seen ] = useState<StringSet>(() => new Set()); // Stores the ID of all cards seen
    const [ likedMovies, setLikedMovies ] = useState<Movie[]>([]) // Stores the actual movie objects that the user likes to be passed to summary page
    const [ userPreference, setUserPreference ] = useState<string | number[]>([]) // An updating array of 768 length that represents an embedding of the user's preferences
    const [ currentMovieIndex, setCurrentMovieIndex ] = useState<number>(generateRandomIndex(movies));  // The index of movie currently shown
    const [ info, setInfo ] = useState<boolean>(false)  // Used with the toggle so user can opt to diplay more/less info

    const [ props, api ] = useSprings(1, i => ({
      ...to(i),
      from: from(i),
    })) //Create a bunch of springs using the helpers above

    const [ fadeInSpringRepeat ] = useSpring(
        () => {
            return (
                {
                    from: { opacity: 0, scale: 0 },
                    to: { opacity: 1, scale: 1 },
                    reset: true,
                    config: { tension: 280, friction: 110 }
                }
            )
        }, [ currentMovieIndex ])

    const [ fadeInRepeat ] = useSpring(
      () => {
          return (
              {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                  reset: true,
                  config: { tension: 200, friction: 150 }
              }
          )
      }, [ currentMovieIndex ])
      // console.log(userPreference)
    // Create a gesture, we're interested in down-state (this means whether or not the element is clicked), delta (current-pos - click-pos), direction and velocity
    const bind = useDrag(({ args: [index], active, movement: [mx], direction: [xDir], velocity: [vx] }) => {
      const trigger = vx > 0.2 //If you flick hard enough, it should trigger the card to fly out
      if (!active && trigger) {

        // The below represents that the user liked the movie
        if(xDir > 0){
            right.add(currentMovieIndex)
            seen.add(movies[currentMovieIndex].movie_id!)

            // This if/else handles the aggregation of likes to create an average embedding representative of the user's taste
            // There are alot of non-null assertions in this area. It would be good to implement more proper error handling with try/catch to avoid having to add these.
            if(!userPreference.length){ // Only runs when it is the first like
                setLikedMovies(prevMovies => [...prevMovies, movies[currentMovieIndex]])

                setUserPreference(movies[currentMovieIndex].embedding!)
                nextRecommendation(movies[currentMovieIndex].embedding!, seen, movies)
                    .then((newIndex) => setCurrentMovieIndex(newIndex!))
            } else {
                setLikedMovies(prevMovies => [...prevMovies, movies[currentMovieIndex]])

                const newPreference = averageEmbeddings(userPreference, movies[currentMovieIndex].embedding!)
                setUserPreference(newPreference)

                nextRecommendation(newPreference, seen, movies)   // Passing in newPreference rather than userPreference because the set action is async and could pass in the pre-updated value
                    .then((newIndex) => setCurrentMovieIndex(newIndex!))
            }
        }

        // The below represents a dislike
        // Currently dislikes are just being ignored rather than having their inverse factored into the user's preference.
        // This is because ex. User likes 3 horror movies in a row, so AI recommends similar horror movies;
        // here's one that the user dislikes. If the inverse were factored in, the would skew the mean with a significant outlier.
        // This may not be the best implementation, as the model will currently recommend the next movie in a series (if available)
        // even if the user just disliked a movie from that series.
        if(xDir < 0){
            left.add(currentMovieIndex)
            seen.add(movies[currentMovieIndex].movie_id!)

            if (userPreference.length){

                const inverse = inverseEmbedding(userPreference)
                const adjustedEmbedding = adjustSimilarity(userPreference, inverse, 2) //Moves the inverse n degrees closer to userPreference. See function for more details.
                setUserPreference(adjustedEmbedding)

                nextRecommendation(adjustedEmbedding, seen, movies)
                    .then((newIndex) => setCurrentMovieIndex(newIndex!))
            } else {
                setCurrentMovieIndex(generateRandomIndex( movies )) // This is a naive solution because it could return a repeat card (1/1000+ chance)
            }
        }
      } //If button or finger is up and the trigger velocity is reached, we flag the card as ready to fly out

      //The below function (api.start) uses the spring animation library
      api.start(i => {
        if (index !== i) return //We're only interested in changing spring data for the current spring
        const isGone = left.has(currentMovieIndex) || right.has(currentMovieIndex) //Checks to see if the current spring is in the gone set
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0 //When a card is gone, it flys out left or right, otherwise it returns to 0 (achieved by multiplying a constant of ( window width + 200 ) by the x coordinate of card)
        const rot = mx / 100 + (isGone ? xDir * 10 * vx : 0) //How much card tilts, flicking it harder makes it rotate faster (Can change the constant in first half of ternary to affect amplitude of effect)
        const scale = active ? 1.1 : 1 //Active cards lift up a bit
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 } //Plain-English for ternary: Is the card active? If so, set the tension to 800. If not, then is the card in the gone set? If so, set the tension to 200, if not, tension should be 500.
        }
      })

        if(!active){
            setTimeout(() => {
            //   left.clear()
            //   right.clear()
                api.start(i => to(i))
            }, 600)
        }
    })
    // Now we're just mapping the animated values to our view, that's it. This component only renders once.
    return (
      <main className="flex flex-col mb-20 lg:mb-28">


        <section className="flex justify-between">
          {/* Additional movie info (toggleable) */}
          { info &&
            <>
              <animated.aside className="flex flex-col order-first gap-4 w-1/3 p-8 mx-8 bg-gradient-to-b from-slate-900/75 to-slate-900/15 rounded-xl" style={fadeInRepeat}>
                <h3 className="text-white/85 text-xl font-semibold">Description</h3>
                <p className="text-white/85 drop-shadow">
                  {movies[currentMovieIndex].overview}
                </p>
              </animated.aside>

              <div className="flex flex-col order-last w-1/3 p-8 m-8 gap-8">
                <animated.aside className="flex flex-col gap-4 p-8 mx-8 bg-gradient-to-b from-slate-900/75 to-slate-900/15 rounded-xl" style={fadeInRepeat}>
                  <h3 className="text-white/85 text-xl font-semibold">Title</h3>
                  <p className="text-white/85 drop-shadow">
                    {movies[currentMovieIndex].title}
                  </p>
                </animated.aside>

                <animated.aside className="flex flex-col gap-4 p-8 mx-8 bg-gradient-to-b from-slate-900/75 to-slate-900/15 rounded-xl" style={fadeInRepeat}>
                  <h3 className="text-white/85 text-xl font-semibold">Release Date</h3>
                  <p className="text-white/85 drop-shadow">
                    {movies[currentMovieIndex].release_date}
                  </p>
                </animated.aside>
              </div>
            </>
          }

          {props.map(({ x, y, rot, scale }, i) => (
            <animated.div className={styles.deck} key={i} style={{ x, y }}>
              {/* This is the card itself, we're binding our gesture to it (and inject its index so we know which is which) */}
              <animated.div
                {...bind(i)}
                style={{
                  transform: interpolate([rot, scale], trans),
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movies[currentMovieIndex].poster_path})`,
                }}
              />
            </animated.div>
          ))}
        </section>

        <section className="flex flex-wrap justify-center align-center gap-3 max-w-screen-sm height-sm:hidden">
            {movies[currentMovieIndex].genre_ids?.map(genre => {
                const genreName = genreFromGenreId(genre)
                return genreName !== "" && <animated.div key={genre} className="text-white/80 text-xs py-3 px-6 m-0 rounded-full bg-gradient-to-t from-gray-700/90 to-gray-800/20 drop-shadow-sm" style={fadeInSpringRepeat}>{genreName}</animated.div>
            })}
        </section>
        <div className="hidden sm:block fixed bottom-24 height-sm:hidden">
          <Toggle handleClick={() => setInfo(prevInfo => !prevInfo)} />
        </div>
        <Link className="text-white/90 text-xl py-4 px-8 fixed bottom-7 rounded-full bg-slate-700/75 drop-shadow-sm hover:bg-green-600/75 hover:scale-110 transition ease-in-out duration-300"
          to={"/summary"} state={{ liked: likedMovies }}>View your Likes
        </Link>

      </main>
    )
  }
