import MainNavBar from "../components/MainNavbar";

const Debates = () => {
    return (
        <>
            <MainNavBar />
            <div className="h-screen flex justify-center 
            items-center bg-green-300">
                <h1 className="lg:text-9xl text-3xl uppercase font-black">About Page</h1>
            </div>
        </>
    );
};

export default Debates;