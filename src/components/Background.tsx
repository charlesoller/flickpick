import { Gradient } from "../utils/gradient.js"
import { useState, useEffect } from "react"

import Spinner from "./Spinner.js"

import styles from '../styles.module.css'

export default function Background() {
    const [ gradientRes, setGradientRes ] = useState(false)

    useEffect(() => {
        const gradient = new Gradient()
        // @ts-ignore
        //Typescript flags this as not having an initGradient property on gradient, which is true, but initGradient is set up as a custom event listener and is necessary for the background to work
        gradient.initGradient('#gradient-canvas')
        setGradientRes(true)
    })

    return (
        <>
            {
                gradientRes ?
                <canvas id="gradient-canvas" data-transition-in />
                : (
                    <div className={`flex fill center ${styles.container} bg-slate-800`}>
                        <div className='absolute top-96'><Spinner /></div>
                    </div>
                )
            }
        </>
    )
}
