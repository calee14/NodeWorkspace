import MainNavBar from "../components/MainNavbar";

const About = () => {
    return (
        <>
            <MainNavBar />
            <div className="h-screen flex justify-center 
            items-center bg-yellow-300">
                <h1 className="lg:text-9xl text-3xl uppercase font-black">About Page</h1>
            </div>
        </>
    )
}

export default About;