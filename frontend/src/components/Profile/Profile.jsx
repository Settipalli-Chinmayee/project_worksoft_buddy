import { Link } from "react-router-dom"


const Profile = () =>{
    return(
        <>
        <div className="flex justify-evenly mb-[15px]">
            <div>
            <Link to='/settings' >
            <img src="./src/assets/img/settings-2-svgrepo-com.svg" className="w-[20px]" alt="" />
            </Link>
            </div>
            <img  src="./src/assets/img/user-01-svgrepo-com.svg" className="w-[20px]" alt="" />
        </div>
        </>
    )
}

export default Profile