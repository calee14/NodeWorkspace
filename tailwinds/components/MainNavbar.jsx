import { useEffect, useState } from "react";
import Dropdown from "./Dropdown"
import Navbar from "./Navbar"

const MainNavBar = () => {

    const [isOpen, setIsOpen] = useState(false);
    
    const toggle = () => {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        const hideMenu = () => {
            if(window.innerWidth > 769 && isOpen) {
                setIsOpen(false);
            }
        }

        window.addEventListener('resize', hideMenu);

        return () => {
            window.removeEventListener('resize', hideMenu);
        }
    })

    return (
        <>
            <Navbar toggle={toggle} />
            <Dropdown isOpen={isOpen} />
        </>
    );
};

export default MainNavBar;