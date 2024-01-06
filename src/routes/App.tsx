import { useState, useEffect } from 'react'

import { fetchAndLoadNewMovies } from '../utils/fetch'

import Deck from '../components/Deck'
import Background from "../components/Background"
import Spinner from '../components/Spinner'

import styles from '../styles.module.css'


// import { loadMovies, fetchMovies } from "./utils/fetch"
// import { embedAndStoreDocument } from "./utils/embedding"
// import { parseMovieInfo, addMovieToSupabase, getCurrentMovieIds } from './utils/helper'
// import { fetchAndLoadNewMovies } from './utils/fetch'

// async function handleClick(){

//   // Loads an array of movies
//   const movieArr = await loadMovies()
//   // Grabs movies already in database
//   const currentMovieIds = await getCurrentMovieIds();

//   movieArr.forEach(async (movie) => {
//     if(!currentMovieIds?.includes(movie.id)){
//       //Adds movie with info to Supabase
//       await addMovieToSupabase(movie)

//       // Deals with creating string from raw data and then embedding and storing in Supabase with ID to link to movie table
//       const movieObj = parseMovieInfo(movie)
//       await embedAndStoreDocument(movieObj)
//     }
//   })
//   // const movies = await fetchMovies()
//   // userLike()
// }

export default function App() {
  const [ movies, setMovies ] = useState([])

  // Fetches any new movies and loads into database, then loads up movies from Supabase on first load
  useEffect(() => {
    const loadMovies = async() => {
        const { movies, count } = await fetchAndLoadNewMovies()
        console.log(`${count} new movie(s) loaded`)
        // console.log("USE EFFECT", movies)
        setMovies(movies) // Unsure of this error
        return
    }

    loadMovies();
}, [])

  return (
    <div>

      <div className={`flex fill center ${styles.container}`}>
        {
          movies.length ?
          <Deck movies={movies}/>
          : <div className='absolute top-96'><Spinner /></div>
        }

        {/* <button className="bg-white w-16 border rounded-md" onClick={() => handleClick()}>
          Click
        </button> */}


      </div>
    </div>
  )
}
