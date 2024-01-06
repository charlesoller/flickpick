export default function Toggle({handleClick}){
    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" />
            <div onClick={handleClick} className="w-11 h-6 bg-slate-200/25 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white/20 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white/80 after:border-gray-300/20 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-500/50 drop-shadow-lg"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300 opacity-50">Movie Info</span>
        </label>
    )
}
