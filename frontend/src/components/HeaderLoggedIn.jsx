import { useState, useEffect } from "react";
import "./header.css";

const HeaderLoggedIn = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="h-[80px] w-full flex items-center justify-between px-4 bg-transparent fixed top-0 left-0 right-0 z-50">
            <div className="flex items-center">
                <img src="../public/Astreon_Logo.svg" alt="Logo" className="h-10" />
            </div>

            {/* Desktop: Show Calendar & Profile */}
            {!isMobile ? (
                <div className="md:flex space-x-4 items-center">
                    <p className="text-black cursor-pointer hover:text-gray-800">Calendar</p>
                    <img
                        src="../public/user-profile-default.png"
                        alt="User Profile"
                        className="h-12 w-12 rounded-full cursor-pointer"
                    />
                </div>
            ) : (
                /* Mobile: Show Hamburger Menu */
                <div className="relative">
                    <img
                        src="../public/Menu.svg"
                        alt="Menu"
                        className="h-8 w-8 cursor-pointer"
                        onClick={toggleDropdown}
                    />

                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md p-2">
                            <p className="text-black cursor-pointer hover:text-gray-800 p-2">Calendar</p>
                            <p className="text-black cursor-pointer hover:text-gray-800 p-2">Profile</p>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default HeaderLoggedIn;
