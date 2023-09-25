import { Link } from "react-router-dom";
import {MdLightMode, MdModeNight} from "react-icons/md"
import { useTheme } from "../Contexts/useTheme";
import { useState } from "react";
import Button from "./Button";
import { useAuth } from "../Contexts/useAuth";
import { ProfileImage } from "./ProfileImage";
import ProfileDropdown from "./ProfileDropdown";

export function Navbar(){
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    
    const {user } = useAuth()

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
    

    return <>
    <nav className="bg-light-primaryBg2  dark:bg-dark-primaryBg2 relative flex flex-wrap items-center justify-between px-2 py-3 border-b-2 border-gray-300">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between sm:flex-row gap-2 sm:gap-0">
        <div className="w-full sm:w-fit relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start ">
            <div className="flex items-start">
                <div className="text-2xl italic text-light-text ">
                    <Link to={"/"} >
                        Receptao
                    </Link>
                </div>
            </div>
            <button onClick={()=>setIsMenuOpen(!isMenuOpen)} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
        </div>
        <div className={` ${isMenuOpen? "flex": "hidden"} w-full sm:w-auto justify-end flex-col sm:flex sm:flex-row  flex-1 sm:gap-4 justify-items-center gap-4`} id="navbar-default">   
            <div className="flex justify-start">
            {!user?
                <Button color="green" className="w-full sm:w-[default] text-white">
                    <Link className="text-white" to={"/login"}>
                        Login
                    </Link>
                </Button>
                :
                <div onClick={()=>toggleDropdown()} className="relative inline-block text-left">
                    <ProfileImage src={user.image} size="medium"/>
                    <ProfileDropdown isOpen={isOpen}></ProfileDropdown>
                </div>
            }
            </div>
            <div className="flex items-center">
                <div onClick={()=>toggleTheme()} className="sm:w-[30px] w-full sm:rounded-[50%] bg-pink-600 hover:bg-pink-300 h-[30px] flex items-center justify-center">
                  
                    {theme === "light"?
                        <MdModeNight />
                    :
                        <MdLightMode />
                    }
                </div>
                
            </div>

        </div>
      </div> 
    </nav>
  </>
    
}