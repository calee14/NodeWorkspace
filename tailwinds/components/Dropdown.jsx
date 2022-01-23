import Link from "next/link";

const Dropdown = (props) => {
    const { isOpen } = props;

    return (
        <div className={isOpen ? "grid grid-rows-4 text-center items-center bg-yellow-500" : "hidden"}>
            <Link href='/'><a className="p-4">Home</a></Link>
            <Link href='/debates'><a className="p-4">Debates</a></Link>
            <Link href='/about'><a className="p-4">About</a></Link>
            <Link href='/contact'><a className="p-4">Contact</a></Link>
        </div>
    )
}

export default Dropdown;