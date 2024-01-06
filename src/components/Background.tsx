import { Gradient } from "../utils/gradient.js"
import { useState, useEffect } from "react"


export default function Background() {
    const [ gradientRes, setGradientRes ] = useState(false)

    // console.log(res)

    useEffect(() => {
        const gradient = new Gradient()
        gradient.initGradient('#gradient-canvas')
        setGradientRes(true)
    })

    return (
        <>
            {
                gradientRes ?
                <canvas id="gradient-canvas" data-transition-in />
                : <h1> Loading Background... </h1>
            }
        </>
    )
}
