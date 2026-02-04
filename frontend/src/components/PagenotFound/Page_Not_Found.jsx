import { useState } from "react";
import { Link } from "react-router-dom"


const Page_Not_Found = () => {
    const [isDark, setIsDark] = useState(
        () => localStorage.getItem("theme") === "dark"
    );

    return (
        <>
            <div className={`flex flex-col min-h-screen items-center w-screen font-display-main ${isDark ? "bg-[#121212] text-white" : "bg-white text-black"}`}>
                <img src="./src/assets/images/pageNotFound.svg" width={500} />
                <p className="text-2xl">
                    Go to{" "}
                    <Link to="/" className="underline text-green-700 font-bold">
                        Home
                    </Link>{" "}
                    page...!
                </p>
            </div>
        </>
    )
}

export default Page_Not_Found