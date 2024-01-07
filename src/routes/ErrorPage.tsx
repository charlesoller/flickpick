export default function ErrorPage(){
    return (
        <main className="w-fit mt-20 mx-auto py-8 px-20">
            <h1 className="text-8xl font-bold bg-gradient-to-b from-white/80 to-white/30 inline-block text-transparent bg-clip-text drop-shadow-xl mb-8">404</h1>
            <p className="text-xl text-white/90">
                Sorry, but I couldn't find this page for you.
            </p>
            <br />
            <p className="text-xl text-white/90">
                Please click the logo in your top right to return to the home page.
            </p>
        </main>
    )
}
