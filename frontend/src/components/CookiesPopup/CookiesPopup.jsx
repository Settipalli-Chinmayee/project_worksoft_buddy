import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CookiesPopup = ({ setHasAcceptedCookies }) => {
    const [showPopup, setShowPopup] = useState(false);

    const [isDark, setIsDark] = useState(
        () => localStorage.getItem("theme") === "dark"
      );
    
      useEffect(() => {
        const localTheme = localStorage.getItem("theme");
    
        if (localTheme === "dark") {
          setIsDark(true);
        } else if (localTheme === "light") {
          setIsDark(false);
        } else {
          // If no local theme is set, use system preference
          const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");
    
          const handleThemeChange = (e) => {
            setIsDark(e.matches);
          };
    
          // Initial check
          setIsDark(darkTheme.matches);
    
          // Listen for system theme changes
          darkTheme.addEventListener("change", handleThemeChange);
    
          // Cleanup on unmount
          return () => darkTheme.removeEventListener("change", handleThemeChange);
        }
      }, []);

    useEffect(() => {
        const cookiesAccepted = Cookies.get("cookiesAccepted") === "true";

        if (cookiesAccepted) {
            setHasAcceptedCookies(true);
            return;
        }

        const timer = setTimeout(() => {
            setShowPopup(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, [setHasAcceptedCookies]);

    const handleAccept = () => {
        Cookies.set("cookiesAccepted", "true", { expires: 1 });
        localStorage.setItem("cookiesAccepted", "true");

        setHasAcceptedCookies(true);
        setShowPopup(false);
    };

    const handleDeny = () => {
        Cookies.set("cookiesAccepted", "true", { expires: 1 });
        localStorage.setItem("cookiesAccepted", "true");

        setHasAcceptedCookies(true);
        setShowPopup(false);
    };

    return (
        showPopup && (
            <>
                {/* <div className="fixed bg-gray-50 inset-0 opacity-50 z-40"></div> */}
            <div className={`fixed  inset-0 opacity-50 z-40 ${isDark ? 'bg-black' : 'bg-gray-50'}`}></div>

                <div className={`fixed bottom-13 left-5 p-4  z-50 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] rounded-[15px]  text-[12px] sm:text-[13px] md:text-[14px]
                ${isDark ? 'text-gray-400 bg-black border border-[#ffc300]'  : 'text-gray-700 border border-[#80808030] bg-white shadow-[0px_2px_8px_0px_#e5e5e5]'}
                `}>
                    <p className={`${isDark ? 'text-white':'text-black'}`}>
                        We use cookies to improve your experience and analyze traffic.
                        {/* Please accept or deny to continue using the login feature. */}
                    </p>
                    <div className="flex justify-end mt-[10px]">
                        <button
                            onClick={handleAccept}
                            className="mr-[10px] sm:text-[13px] md:text-[14px] border border-[#283E46] cursor-pointer text-orange-500 px-3 py-1 font-semibold rounded-full mt-2 bg-white w-[20%]"
                        >
                            Accept
                        </button>
                        <button
                            onClick={handleDeny}
                            className=" text-[12px] sm:text-[13px] md:text-[14px] border border-[#283E46] cursor-pointer text-orange-500 px-3 py-1 font-semibold rounded-full mt-2 bg-white w-[20%]"
                        >
                            Deny
                        </button>
                    </div>
                </div>
            </>
        )
    );
};

export default CookiesPopup;
