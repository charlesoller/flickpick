// Functions
import { Outlet } from "react-router"

// Components
import Header from "../components/Header"
import Background from "../components/Background"

export default function Layout(){
    return (
        <>
            <Header />
            <Outlet />
            <Background />
        </>

    )
}
