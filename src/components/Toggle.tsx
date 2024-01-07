//@ts-nocheck
// The above is only turned on becuase of the div which receives an onClick through props. The onClick is expecting a native event handler from what I can tell
// but instead received a function. This is fairly standard in React as far as I'm aware and I couldn't find a good solution to this online though I'm sure there is.

export default function Toggle({handleClick}: {handleClick: Function}){
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div onClick={handleClick} className="w-11 h-6 bg-slate-200/25 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white/20 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/80 after:border-gray-300/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500/50 drop-shadow-lg peer-checked:hover:bg-green-600/75 hover:bg-green-600/75 hover:scale-110 transition ease-in-out duration-300"></div>
            <span className="ms-3 text-sm font-medium text-gray-300 opacity-50 hover:text-green-400/90 transition ease-in-out duration-300">Movie Info</span>
        </label>
    )
}
