import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"


const Logout = () => {
    const navigate = useNavigate()
    
    const logoutPage = async (e) => {
        // console.log("hello");
        e.preventDefault()
        // navigate('/login')
        try {
            const response = await fetch('https://worksoftbuddyapi.qualesce.com/api/v1/users/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const result = await response.json();
                if (result) {
                    navigate('/')
                }
                console.log(result);
            } else {
                console.log("Error: ", response.status);
            }
        } catch (err) {
            console.log("Request failed: ", err);
        }
    }
return (
    <>
        <div>
            <Link className="bg-green-700 hover:White text-white font-bold py-2 px-8 w-full rounded-[8px]" onClick={logoutPage}  >Logout</Link>
        </div>
    </>
)
}
export default Logout

