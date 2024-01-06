import { Link } from "react-router-dom"

export default function Header(){
    return (
        <header className="flex justify-between p-6 bg-gradient-to-b from-slate-900/90 to-transparent w-full h-16 absolute">
            <Link to="/" className="text-white font-bold text-2xl hover:text-green-400 transition ease-in-out duration-300" >FlickPick</Link>
            <Link to="/about" className="text-white hover:text-green-400 transition ease-in-out duration-300">About</Link>
        </header>
    )
}
