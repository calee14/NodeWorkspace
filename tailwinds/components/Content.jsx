import Image from "next/image";

const Content = () => {
    const imgAddress = "https://ihc.ucsb.edu/wp-content/uploads/2019/02/Rupe_op1.jpg";
    const imgAddress2 = "https://www.comm.ucsb.edu/sites/secure.lsit.ucsb.edu.comm.d7-3/files/sitefiles/images/Rupe2011NetWorth.jpg"
    return (
        <>
            <div className="flex flex-col justify-center items-center 
            bg-white h-screen font-mono py-40">
                <Image src={imgAddress} className="h-full rounded mb-20 shadow" height="1000" width="1000"/>
                <div className="flex flex-col justify-center
                items-center">
                    <h2 className="text-2xl mb-2">Visitors</h2>
                    <p className="mb-2">Honarable, Humble, 
                    Having a good conversation</p>
                    <span>October 21, 2222</span>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center 
            bg-white h-screen font-mono py-40">
                <Image src={imgAddress2} className="h-full rounded mb-20 shadow" height="1000" width="1000"/>
                <div className="flex flex-col justify-center
                items-center">
                    <h2 className="text-2xl mb-2">Visitors</h2>
                    <p className="mb-2">Honarable, Humble, 
                    Having a good conversation</p>
                    <span>October 21, 2222</span>
                </div>
            </div>
        </>
    );
}

export default Content;