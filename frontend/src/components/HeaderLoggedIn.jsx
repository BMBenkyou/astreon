import { useState } from "react";
import "./header.css";


const HeaderLoggedIn = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="h-[80px] w-full flex items-center justify-between px-4 bg-transparent fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center">
                <img src="../public/Astreon_Logo.svg" alt="Logo" className="h-10" />
            </div>

            <div className="spacing-right md:flex space-x-1 items-center">
                <p className="text-black cursor-pointer hover:text-gray-800 mt-4">Calendar</p>
                <img
                    src="../public/user-profile-default.png"
                    alt="User Profile"
                    className="h-15 w-15 rounded-full mr-[30px] cursor-pointer"
                />

            </div>
        </header>
    );
};

export default HeaderLoggedIn;
