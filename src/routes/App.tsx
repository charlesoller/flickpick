// Functions
import { useState, useEffect } from 'react'
import { fetchAndLoadNewMovies } from '../utils/fetch'

// Components
import Deck from '../components/Deck'
import Spinner from '../components/Spinner.tsx'

// CSS
import styles from '../styles.module.css'

// Types
import { Movie } from '../utils/types.ts'

export default function App() {
  const [ movies, setMovies ] = useState<Movie[]>([])

  // Fetches any new movies and loads into database, then loads up movies from Supabase on first load
  useEffect(() => {
    const loadMovies = async() => {
      try {
        const { movies, count }: { movies: Movie[] | null, count: number } = await fetchAndLoadNewMovies()
        console.log(`${count} new movie(s) loaded`)
        if (movies){
          setMovies(movies)
        } else {
          throw new Error("Movies unable to load. Please refresh page and try again.")
        }
      } catch (e: any) {  // I found this to be pretty interesting after looking into it. Even though you would assume only an Error object could be thrown, Javascript allows you to really throw anything as an error, so you have to declare the type as any.
        console.error(e.message)
      }

      return
    }

    loadMovies();
}, [])

  return (
    <main>
      <section className={`flex fill center ${styles.container}`}>
        {
          movies.length ?
          <Deck movies={movies}/>
          : <div className='absolute top-96'><Spinner /></div>
        }
      </section>
    </main>
  )
}
