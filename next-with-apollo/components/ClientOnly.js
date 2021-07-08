import { useEffect, useState } from "react";

export default function ClientOnly({ children, ...delegated }) {
    const [hasMounted, setHasMounted] = useState(false)

    // if the component finished render or rerendered then
    // change mounted var
    useEffect(()=> {
        setHasMounted(true)
    }, [])

    if (!hasMounted) {
        return null;
    }

    // return the children to be rendered when the client finished mounting
    return <div {...delegated}>{children}</div>
}